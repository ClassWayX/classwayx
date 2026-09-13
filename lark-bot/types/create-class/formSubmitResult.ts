interface UniqueConstraintFailed {
  reason: "UNIQUE_CONSTRAINT_FAILED",
  constraint: "classSoftId"
}

export type SubmitError = UniqueConstraintFailed;
export type SubmitOk = "OK"