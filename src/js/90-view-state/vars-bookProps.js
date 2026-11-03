const bookProps = (book = bookPath()) => getPage(book)?.props || {};
