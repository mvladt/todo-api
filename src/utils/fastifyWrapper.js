const fastifyWrapper = {
  baseUrl: undefined,
  fastify: undefined,

  get(url, callback) {
    this.fastify.get(
      this.baseUrl + url,
      { onRequest: [this.fastify.authenticate] },
      callback
    );
  },

  post(url, callback) {
    this.fastify.post(
      this.baseUrl + url,
      { onRequest: [this.fastify.authenticate] },
      callback
    );
  },

  put(url, callback) {
    this.fastify.put(
      this.baseUrl + url,
      { onRequest: [this.fastify.authenticate] },
      callback
    );
  },

  delete(url, callback) {
    this.fastify.delete(
      this.baseUrl + url,
      { onRequest: [this.fastify.authenticate] },
      callback
    );
  },
};

export default fastifyWrapper;
