///<reference path="../reference.ts" />

module Plottable {
export module Core {

  /**
   * A callback for a Broadcaster. The callback will be called with the Broadcaster's
   * "listenable" as the first argument, with subsequent optional arguments depending
   * on the listenable.
   */
  // HACKHACK: An interface because the "type" keyword doesn't work with generics.
  export interface BroadcasterCallback<L> {
    (listenable: L, ...args: any[]): any;
  }

  /**
   * The Broadcaster holds a reference to a "listenable" object.
   * Third parties can register and deregister listeners from the Broadcaster.
   * When the broadcaster.broadcast() method is called, all registered callbacks
   * are called with the Broadcaster's "listenable", along with optional
   * arguments passed to the `broadcast` method.
   *
   * The listeners are called synchronously.
   */
  export class Broadcaster<L> extends Core.PlottableObject {
    private _key2callback = new _Util.StrictEqualityAssociativeArray();
    private _listenable: L;

    /**
     * Constructs a broadcaster, taking a "listenable" object to broadcast about.
     *
     * @constructor
     * @param {L} listenable The listenable object to broadcast.
     */
    constructor(listenable: L) {
      super();
      this._listenable = listenable;
    }

    /**
     * Registers a callback to be called when the broadcast method is called. Also takes a key which
     * is used to support deregistering the same callback later, by passing in the same key.
     * If there is already a callback associated with that key, then the callback will be replaced.
     *
     * @param key The key associated with the callback. Key uniqueness is determined by deep equality.
     * @param {BroadcasterCallback<L>} callback A callback to be called.
     * @returns {Broadcaster} The calling Broadcaster
     */
    public registerListener(key: any, callback: BroadcasterCallback<L>) {
      this._key2callback.set(key, callback);
      return this;
    }

    /**
     * Call all listening callbacks, optionally with arguments passed through.
     *
     * @param ...args A variable number of optional arguments
     * @returns {Broadcaster} The calling Broadcaster
     */
    public broadcast(...args: any[]) {
      this._key2callback.values().forEach((callback) => callback(this._listenable, args));
      return this;
    }

    /**
     * Deregisters the callback associated with a key.
     *
     * @param key The key to deregister.
     * @returns {Broadcaster} The calling Broadcaster
     */
    public deregisterListener(key: any) {
      this._key2callback.delete(key);
      return this;
    }

    /**
     * Deregisters all listeners and callbacks associated with the broadcaster.
     *
     * @returns {Broadcaster} The calling Broadcaster
     */
    public deregisterAllListeners() {
      this._key2callback = new _Util.StrictEqualityAssociativeArray();
    }
  }
}
}
