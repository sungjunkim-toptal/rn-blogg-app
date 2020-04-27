class Blog {
  constructor(id, authorId, author, title, imageUrl, content, publishedDate) {
    this.id = id;
    this.authorId = authorId;
    this.author = author;
    this.title = title;
    this.imageUrl = imageUrl;
    this.content = content;
    this.publishedDate = publishedDate;
  }
}

export default Blog;
