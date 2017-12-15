/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

// helper function
// doubles the storage size once it reaches 75% capacity
  doubleStorage() {
    const percent = this.limit * 0.75;
    if (this.storage.length >= percent) {
      this.limit *= 2;
      const oldStorage = this.storage;
      this.storage = new LimitedArray(this.limit);
      for (let i = 0; i < oldStorage.length; i++) {
        this.storage.set(i, oldStorage[i]);
      }
    }
  }
  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index);
    this.doubleStorage();
    if (bucket === undefined) {
      bucket = new LinkedList();
      bucket.addToTail([key, value]);
      this.storage.set(index, bucket);
      return;
    }
    let currentNode = bucket.head;
    while (currentNode) {
      if (currentNode.value[0] === key) {
        currentNode.value[1] = value;
        this.storage.set(index, bucket);
        return;
      }
      currentNode = currentNode.next;
    }
    bucket.addToTail([key, value]);
    this.storage.set(index, bucket);
  }

  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket !== undefined) {
      let currentNode = bucket.head;
      if (currentNode.value[0] === key) {
        bucket.removeHead();
      } else {
        while (currentNode.next) {
          if (currentNode.next.value[0] === key) {
            currentNode = currentNode.next.next;
          }
          currentNode = currentNode.next;
        }
      }
    }
  }

  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket !== undefined) {
      let currentNode = bucket.head;
      while (currentNode) {
        if (currentNode.value[0] === key) {
          return currentNode.value[1];
        }
        currentNode = currentNode.next;
      }
    }
  }
}

module.exports = HashTable;
