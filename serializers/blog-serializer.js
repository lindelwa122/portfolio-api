class BlogSerializer {
  constructor(Blog) {
    this.returnValue = {
      id: Blog._id,
      title: Blog.title,
      content: Blog.content,
      drafted_on: Blog.drafted_on,
      published_on: Blog.published_on,
      state: Blog.state,
      last_saved: Blog.last_saved,
      stats: Blog.stats,
      url: Blog.url,
    };
  }

  exclude (keys) {
    const keysArr = keys.split(' ');
    for (const key of keysArr) {
      delete this.returnValue[key];
    }
  }

  include (keys) {
    const keysArr = keys.split(' ');
    for (const [key, _] of Object.entries(this.returnValue)) {
      if (!keysArr.includes(key)) {
        delete this.returnValue[key];
      }
    }
  }

  getJSON () {
    return this.returnValue;
  }
}

module.exports = BlogSerializer;