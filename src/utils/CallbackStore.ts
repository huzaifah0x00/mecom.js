import debug from "debug";
import { MeComResponse } from "../MeComFrame";

const log = debug("mecom:callbackstore");

export default class CallbackStore {
  private _callbacksCache: { [sequence: number]: (response: MeComResponse) => void } = {};

  public register(sequence: number, callback: (response: MeComResponse) => void) {
    if (this._callbacksCache[sequence]) {
      log("Callback already registered for sequence, overwriting...");
    }

    this._callbacksCache[sequence] = callback;
  }

  public get(sequence: number): ((response: MeComResponse) => void) | null {
    if (!this._callbacksCache[sequence]) {
      log(`No callback registered for sequence ${sequence}, ignoring frame...`);
      return null;
    }

    return this._callbacksCache[sequence];
  }

  public delete(sequence: number) {
    delete this._callbacksCache[sequence];
  }
}
