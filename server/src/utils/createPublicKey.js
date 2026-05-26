import crypto from "crypto";

function createPublicKey() {
  return `cb_pub_${crypto.randomBytes(16).toString("hex")}`;
}

export default createPublicKey;
