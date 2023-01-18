import ASYMMETRIC_KEY_DETAILS_SUPPORTED from "./asymmetricKeyDetailsSupported.ts"
import RSA_PSS_KEY_DETAILS_SUPPORTED from "./rsaPssKeyDetailsSupported.ts"

import { type KeyObject } from "https://deno.land/std@0.173.0/node/crypto.ts"
import { type AsymmetricKeyDetails } from "https://deno.land/std@0.173.0/node/internal/crypto/keys.ts"

type AsymmetricKeyType =
  | "rsa"
  | "rsa-pss"
  | "dsa"
  | "ec"
  | "ed25519"
  | "ed448"
  | "x25519"
  | "x448";

const allowedAlgorithmsForKeys: { [alg in AsymmetricKeyType]?: string[] } = {
  "ec": ["ES256", "ES384", "ES512"],
  "rsa": ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
  "rsa-pss": ["PS256", "PS384", "PS512"],
};

const allowedCurves = {
  ES256: "prime256v1",
  ES384: "secp384r1",
  ES512: "secp521r1",
};

export default function (
  algorithm: keyof typeof allowedCurves,
  key: KeyObject,
) {
  if (!algorithm || !key) return;

  const keyType = key.asymmetricKeyType as AsymmetricKeyType;
  if (!keyType) return;

  const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];

  if (!allowedAlgorithms) {
    throw new Error(`Unknown key type "${keyType}".`);
  }

  if (!allowedAlgorithms.includes(algorithm)) {
    throw new Error(
      `"alg" parameter for "${keyType}" key type must be one of: ${
        allowedAlgorithms.join(", ")
      }.`,
    );
  }

  if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
    switch (keyType) {
      case "ec": {
        const keyCurve = key?.asymmetricKeyDetails?.namedCurve;
        const allowedCurve = allowedCurves[algorithm];

        if (keyCurve !== allowedCurve) {
          throw new Error(
            `"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`,
          );
        }
        break;
      }
      case "rsa-pss": {
        if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
          const length = parseInt(algorithm.slice(-3), 10);
          const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key
            .asymmetricKeyDetails as AsymmetricKeyDetails;

          if (
            hashAlgorithm !== `sha${length}` ||
            mgf1HashAlgorithm !== hashAlgorithm
          ) {
            throw new Error(
              `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`,
            );
          }

          if (saltLength !== undefined && saltLength > length >> 3) {
            throw new Error(
              `Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`,
            );
          }
        }
        break;
      }
    }
  }
}
