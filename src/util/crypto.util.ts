import { AES, enc } from 'crypto-ts';

export default class CryptoUtil {
  key = process.env['CRYPTO_KEY'];

  encrypt = (value: string): string => {
    return AES.encrypt(value, this.key).toString();
  };

  decrypt = (value) => {
    const bytes = AES.decrypt(value.toString(), this.key);
    const plaintext = bytes.toString(enc.Utf8);

    return plaintext;
  };
}
