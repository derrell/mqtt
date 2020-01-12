/*
 * Copyright : Derrell Lipman, 2020
 * License   : MIT
 * Authors   : Derrell Lipman (derrell)
 */

qx.Class.define("mqtt.Buffer",
{
  extend : qx.core.Object,

  construct : function(unitBufferSize = this.constructor.UNIT_BUFFER_SIZE)
  {
    this.base(arguments);

    // Save the buffer size
    this._unitBufferSize = unitBufferSize;

    // Initialize the pool of data arrays already created
    this._pool = [];

    // Create the first array into which we'll place octets
    this._createArray();
  },

  statics :
  {
    /** The default size of each individual buffer in the stream */
    UNIT_BUFFER_SIZE : 64 * 1024
  },

  members :
  {
    /** The position in the array where the next octet should be placed */
    _next           : 0,

    /** The pool of internal arrays already created */
    _pool           : null,

    /** The size of each individual buffer in the stream */
    _unitBufferSize : 0,


    /**
     * Prepend (in a right-to-left fashion) the next octet into the buffer.
     *
     * @param {Uint8} octet
     *   The octet to be prepended
     */
    prepend : function(octet)
    {
      // Is there isn't room in the current array to prepend this octet...
      if (this._next < 0)
      {
        // Nope. Create a new array
        this._createArray();
      }

      // Prepend the specified octet
      this._current[this._next--] = octet;
    },

    /**
     * Return a final Uint8Array containing all of the data. The array will
     * have two additional properties, `first` and `last`, representing,
     * respectively, the index of the first and last data elements in the
     * array.
     *
     * @param {Boolean} bSlice
     *   If true, return only the used slice of the array.
     *
     * @return {Uint8Array}
     *   The final data in the buffer, with `first` and `last` properties to
     *   indicate the indexes of the first and last data octet in the array.
     */
    finalize : function(bSlice)
    {
      let             arr;

      // Is there more than one array in the pool?
      if (this._pool.length > 1)
      {
        let             len;

        // Yup. Create a new, single array containing all of the data
        len =
          this._pool.reduce((total, array) => total + array.length, 0) -
          (this._next + 1);
        arr = new Uint8Array(len);
        this._pool.forEach(
          (poolElem) =>
            {
              let             j;

              for (j = poolElem.length - 1; j >= 0; j--)
              {
                arr[--len] = poolElem[j];
              }
            });

        // This new array becomes the new _current
        this._current = arr;
        this._next = 0;
        this._pool = [ arr ];

        // The new buffer's data begins at position 0
        arr.first = 0;
      }
      else if (bSlice)
      {
        arr = this._current.slice();
        arr.first = this._next + 1;
        arr.next = arr.first;
      }
      else
      {
        // There's only a single array. Save its starting position.
        arr = this._current;
        arr.first = this._next + 1;
        arr.next = arr.first;
      }

      // Let 'em know where the last element is too
      arr.last = arr.length - 1;

      // If they requested just the used slice, slice it.
      return arr;
    },

    /**
     * Create a new array into which `prepend` will insert octets
     */
    _createArray : function()
    {
      // Instantiate the first array for this buffer
      this._current = new Uint8Array(this._unitBufferSize);

      // There's no push() method on a Uint8Array, so we'll keep an index of the
      // next byte position to be used. Initialize it to the last element of
      // array
      this._next = this._unitBufferSize - 1;

      // Add this array to the pool
      this._pool.push(this._current);
    }
  }
});
