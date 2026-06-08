# v0.2.17
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


# ---------------------------------------------------------------------------
# MedReview — GenLayer Intelligent Contract
#
# Healthcare triage intelligence layer.
#
# Source of truth for:
# - submitted health context
# - AI triage review
# - urgency level
# - safety flags
# - follow-up history
#
# IMPORTANT:
# This contract does NOT diagnose.
# It performs triage review only.
# ---------------------------------------------------------------------------


URGENCY_SELF_MONITOR = "SELF_MONITOR"
URGENCY_ROUTINE_DOCTOR = "ROUTINE_DOCTOR"
URGENCY_SOON_DOCTOR = "SOON_DOCTOR"
URGENCY_URGENT_CARE = "URGENT_CARE"
URGENCY_EMERGENCY = "EMERGENCY"

STATUS_CREATED = "created"
STATUS_REVIEWING = "reviewing"
STATUS_REVIEWED = "reviewed"
STATUS_FOLLOW_UP_SUBMITTED = "follow_up_submitted"
STATUS_FOLLOW_UP_REVIEWED = "follow_up_reviewed"
STATUS_FLAGGED_EMERGENCY = "flagged_emergency"
STATUS_ARCHIVED = "archived"


class MedReview(gl.Contract):
    owner: Address
    review_count: u256
    followup_count: u256

    reviews: TreeMap[str, str]
    user_reviews: TreeMap[str, str]
    triage_results: TreeMap[str, str]
    followups: TreeMap[str, str]
    review_followups: TreeMap[str, str]
    safety_flags: TreeMap[str, str]
    protocol_state: TreeMap[str, str]

    def __init__(self) -> None:
        self.owner = gl.message.sender_address
        self.review_count = u256(0)
        self.followup_count = u256(0)

        self.reviews = TreeMap[str, str]()
        self.user_reviews = TreeMap[str, str]()
        self.triage_results = TreeMap[str, str]()
        self.followups = TreeMap[str, str]()
        self.review_followups = TreeMap[str, str]()
        self.safety_flags = TreeMap[str, str]()
        self.protocol_state = TreeMap[str, str]()

        self.protocol_state["name"] = "MedReview"
        self.protocol_state["notice"] = (
            "MedReview provides triage guidance only. "
            "It does not diagnose, prescribe, or replace emergency care."
        )

    # -----------------------------------------------------------------------
    # Internal JSON helpers
    # -----------------------------------------------------------------------

    def _loads_dict(self, raw: str) -> dict:
        try:
            data = json.loads(raw)
            if isinstance(data, dict):
                return data
            return {}
        except Exception:
            return {}

    def _loads_list(self, raw: str) -> list:
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                return data
            return []
        except Exception:
            return []

    def _as_list(self, value) -> list:
        if isinstance(value, list):
            return value
        if value is None:
            return []
        return [str(value)]

    def _safe_confidence(self, value) -> float:
        try:
            n = float(value)
            if n < 0:
                return 0.0
            if n > 1:
                return 1.0
            return n
        except Exception:
            return 0.7

    def _valid_urgency(self, value: str) -> str:
        urgency = str(value)

        if urgency == URGENCY_SELF_MONITOR:
            return URGENCY_SELF_MONITOR
        if urgency == URGENCY_ROUTINE_DOCTOR:
            return URGENCY_ROUTINE_DOCTOR
        if urgency == URGENCY_SOON_DOCTOR:
            return URGENCY_SOON_DOCTOR
        if urgency == URGENCY_URGENT_CARE:
            return URGENCY_URGENT_CARE
        if urgency == URGENCY_EMERGENCY:
            return URGENCY_EMERGENCY

        return URGENCY_ROUTINE_DOCTOR

    def _require_review_exists(self, review_id: str) -> str:
        raw = self.reviews.get(review_id, "")
        if raw == "":
            raise gl.vm.UserError("review_not_found")
        return raw

    def _require_review_missing(self, review_id: str) -> None:
        existing = self.reviews.get(review_id, "")
        if existing != "":
            raise gl.vm.UserError("review_already_exists")

    def _require_review_owner(self, review_id: str, caller: str) -> dict:
        raw = self._require_review_exists(review_id)
        data = self._loads_dict(raw)

        review_owner = str(data.get("user_address", ""))
        contract_owner = str(self.owner)

        if caller != review_owner and caller != contract_owner:
            raise gl.vm.UserError("not_review_owner")

        return data

    def _append_to_index(self, map_ref: TreeMap[str, str], key: str, item: str) -> None:
        raw = map_ref.get(key, "[]")
        values = self._loads_list(raw)

        if item not in values:
            values.append(item)

        map_ref[key] = json.dumps(values)

    def _create_review_record(self, review_id: str, review_json: str, caller: str) -> None:
        self._require_review_missing(review_id)

        data = self._loads_dict(review_json)
        if len(data.keys()) == 0:
            data = {"free_text": review_json}

        data["review_id"] = review_id
        data["user_address"] = caller
        data["status"] = STATUS_CREATED

        self.reviews[review_id] = json.dumps(data)
        self.review_count = self.review_count + u256(1)

        self._append_to_index(self.user_reviews, caller, review_id)

    def _store_reviewing_state(self, review_id: str, payload_json: str, caller: str) -> str:
        existing = self.reviews.get(review_id, "")
        effective_user = caller

        if existing == "":
            self._create_review_record(review_id, payload_json, caller)
        else:
            existing_data = self._loads_dict(existing)
            review_owner = str(existing_data.get("user_address", ""))

            if caller != review_owner and caller != str(self.owner):
                raise gl.vm.UserError("not_review_owner")

            if review_owner != "":
                effective_user = review_owner

        data = self._loads_dict(payload_json)
        if len(data.keys()) == 0:
            data = {"free_text": payload_json}

        data["review_id"] = review_id
        data["user_address"] = effective_user
        data["status"] = STATUS_REVIEWING

        self.reviews[review_id] = json.dumps(data)
        return json.dumps(data)

    def _run_ai_json(self, prompt: str) -> str:
        result = gl.eq_principle.prompt_non_comparative(
            lambda: prompt,
            task=(
                "Review the MedReview healthcare triage prompt and return only the strict JSON "
                "object requested by the prompt."
            ),
            criteria=(
                "The response must be valid JSON only. "
                "It must not contain markdown, prose outside JSON, code fences, or extra commentary. "
                "It must follow the exact structure requested in the prompt. "
                "For triage reviews, urgency_level must be one of SELF_MONITOR, ROUTINE_DOCTOR, "
                "SOON_DOCTOR, URGENT_CARE, or EMERGENCY. "
                "For red-flag detection, urgency_override must be one of EMERGENCY, URGENT_CARE, or NONE. "
                "The response must not diagnose. "
                "The response must not prescribe medication. "
                "The response must not claim certainty. "
                "The response must preserve the MedReview safety position that this is triage guidance only."
            ),
        )
        return str(result)

    # -----------------------------------------------------------------------
    # Write functions
    # -----------------------------------------------------------------------

    @gl.public.write
    def create_review_session(self, review_id: str, review_json: str) -> None:
        caller = str(gl.message.sender_address)
        self._create_review_record(review_id, review_json, caller)

    @gl.public.write
    def submit_symptom_review(self, review_id: str, symptom_json: str) -> None:
        caller = str(gl.message.sender_address)

        stored_review_json = self._store_reviewing_state(
            review_id,
            symptom_json,
            caller,
        )

        red_flag_result = self._detect_red_flags(stored_review_json)
        red_flag_data = self._loads_dict(red_flag_result)

        if bool(red_flag_data.get("red_flags_present", False)):
            self.safety_flags[review_id] = red_flag_result

        triage_result = self._review_symptoms(stored_review_json, "{}")
        data = self._loads_dict(stored_review_json)
        data["status"] = STATUS_REVIEWED
        self.reviews[review_id] = json.dumps(data)
        self.triage_results[review_id] = triage_result

    @gl.public.write
    def submit_report_review(self, review_id: str, report_json: str) -> None:
        caller = str(gl.message.sender_address)
        stored_review_json = self._store_reviewing_state(review_id, report_json, caller)
        red_flag_result = self._detect_red_flags(stored_review_json)
        red_flag_data = self._loads_dict(red_flag_result)
        if bool(red_flag_data.get("red_flags_present", False)):
            self.safety_flags[review_id] = red_flag_result
        triage_result = self._review_report(stored_review_json)
        data = self._loads_dict(stored_review_json)
        data["status"] = STATUS_REVIEWED
        self.reviews[review_id] = json.dumps(data)
        self.triage_results[review_id] = triage_result

    @gl.public.write
    def submit_follow_up(self, review_id: str, followup_id: str, followup_json: str) -> None:
        caller = str(gl.message.sender_address)
        self._require_review_exists(review_id)
        data = self._loads_dict(followup_json)
        data["followup_id"] = followup_id
        data["review_id"] = review_id
        data["user_address"] = caller
        data["status"] = STATUS_REVIEWING
        stored = json.dumps(data)
        self.followups[followup_id] = stored
        self.followup_count = self.followup_count + u256(1)
        self._append_to_index(self.review_followups, review_id, followup_id)
        prior_result = self.triage_results.get(review_id, "{}")
        followup_result = self._review_followup(stored, prior_result)
        f_data = self._loads_dict(stored)
        f_data["status"] = STATUS_FOLLOW_UP_REVIEWED
        self.followups[followup_id] = json.dumps(f_data)
        self.triage_results[followup_id] = followup_result
        r_data = self._loads_dict(self.reviews.get(review_id, "{}"))
        r_data["status"] = STATUS_FOLLOW_UP_REVIEWED
        self.reviews[review_id] = json.dumps(r_data)

    @gl.public.write
    def archive_review(self, review_id: str) -> None:
        caller = str(gl.message.sender_address)
        data = self._require_review_owner(review_id, caller)
        data["status"] = STATUS_ARCHIVED
        self.reviews[review_id] = json.dumps(data)

    @gl.public.write
    def flag_emergency_review(self, review_id: str, reason: str) -> None:
        caller = str(gl.message.sender_address)
        data = self._require_review_owner(review_id, caller)
        data["status"] = STATUS_FLAGGED_EMERGENCY
        self.reviews[review_id] = json.dumps(data)
        flag = {
            "review_id": review_id,
            "reason": reason,
            "flagged_by": caller,
            "urgency_override": URGENCY_EMERGENCY,
            "red_flags_present": True,
        }
        self.safety_flags[review_id] = json.dumps(flag)

    # -----------------------------------------------------------------------
    # AI helpers
    # -----------------------------------------------------------------------

    def _detect_red_flags(self, review_json: str) -> str:
        prompt = f"""You are a medical triage safety system.
Analyze this health review and detect red flags.
Review: {review_json}

Return ONLY this JSON:
{{
  "red_flags_present": true or false,
  "urgency_override": "EMERGENCY" or "URGENT_CARE" or "NONE",
  "red_flags": ["list of red flag descriptions"],
  "safety_message": "brief safety message if red flags present, else empty string"
}}"""
        raw = self._run_ai_json(prompt)
        return raw.strip()

    def _review_symptoms(self, review_json: str, prior_context: str) -> str:
        prompt = f"""You are a medical triage AI. Perform a triage review for the following symptom report.
Review: {review_json}
Prior context: {prior_context}

Return ONLY this JSON:
{{
  "urgency_level": "SELF_MONITOR" | "ROUTINE_DOCTOR" | "SOON_DOCTOR" | "URGENT_CARE" | "EMERGENCY",
  "confidence": 0.0 to 1.0,
  "possible_condition_categories": ["list"],
  "red_flags_present": true or false,
  "red_flags": ["list"],
  "summary": "brief triage summary",
  "recommended_next_step": "what the patient should do",
  "self_care_general": ["list of self-care tips"],
  "what_to_monitor": ["list of things to watch for"],
  "questions_for_doctor": ["list of questions"],
  "not_diagnosis_notice": "This is not a diagnosis. Please consult a qualified healthcare professional.",
  "reasoning": "brief reasoning"
}}"""
        return self._run_ai_json(prompt).strip()

    def _review_report(self, review_json: str) -> str:
        prompt = f"""You are a medical triage AI. Review the following medical report or test result.
Review: {review_json}

Return ONLY this JSON:
{{
  "urgency_level": "SELF_MONITOR" | "ROUTINE_DOCTOR" | "SOON_DOCTOR" | "URGENT_CARE" | "EMERGENCY",
  "confidence": 0.0 to 1.0,
  "possible_condition_categories": ["list"],
  "red_flags_present": true or false,
  "red_flags": ["list"],
  "summary": "brief triage summary",
  "recommended_next_step": "what the patient should do",
  "self_care_general": ["list"],
  "what_to_monitor": ["list"],
  "questions_for_doctor": ["list"],
  "not_diagnosis_notice": "This is not a diagnosis. Please consult a qualified healthcare professional.",
  "reasoning": "brief reasoning"
}}"""
        return self._run_ai_json(prompt).strip()

    def _review_followup(self, followup_json: str, prior_result: str) -> str:
        prompt = f"""You are a medical triage AI reviewing a follow-up to an existing triage.
Follow-up: {followup_json}
Prior triage result: {prior_result}

Return ONLY this JSON:
{{
  "urgency_level": "SELF_MONITOR" | "ROUTINE_DOCTOR" | "SOON_DOCTOR" | "URGENT_CARE" | "EMERGENCY",
  "confidence": 0.0 to 1.0,
  "summary": "brief follow-up triage summary",
  "recommended_next_step": "updated recommendation",
  "what_to_monitor": ["list"],
  "not_diagnosis_notice": "This is not a diagnosis. Please consult a qualified healthcare professional.",
  "reasoning": "brief reasoning"
}}"""
        return self._run_ai_json(prompt).strip()

    # -----------------------------------------------------------------------
    # View functions
    # -----------------------------------------------------------------------

    @gl.public.view
    def get_review(self, review_id: str) -> str:
        return self.reviews.get(review_id, "")

    @gl.public.view
    def get_triage_result(self, review_id: str) -> str:
        return self.triage_results.get(review_id, "")

    @gl.public.view
    def get_user_reviews(self, address: str) -> str:
        return self.user_reviews.get(address, "[]")

    @gl.public.view
    def get_followup(self, followup_id: str) -> str:
        return self.followups.get(followup_id, "")

    @gl.public.view
    def get_review_followups(self, review_id: str) -> str:
        ids_raw = self.review_followups.get(review_id, "[]")
        ids = self._loads_list(ids_raw)
        result = []
        for fid in ids:
            raw = self.followups.get(fid, "")
            if raw:
                result.append(self._loads_dict(raw))
        return json.dumps(result)

    @gl.public.view
    def get_review_followup_ids(self, review_id: str) -> str:
        return self.review_followups.get(review_id, "[]")

    @gl.public.view
    def get_followup_result(self, review_id: str, followup_id: str) -> str:
        return self.triage_results.get(followup_id, "")

    @gl.public.view
    def get_safety_flags(self, review_id: str) -> str:
        return self.safety_flags.get(review_id, "")

    @gl.public.view
    def get_total_reviews(self) -> u256:
        return self.review_count

    @gl.public.view
    def get_total_followups(self) -> u256:
        return self.followup_count

    @gl.public.view
    def get_protocol_state(self) -> str:
        state = {}
        for k in ["name", "notice"]:
            v = self.protocol_state.get(k, "")
            if v:
                state[k] = v
        return json.dumps(state)