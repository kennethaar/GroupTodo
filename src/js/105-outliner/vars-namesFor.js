const namesFor = host => { const book = bookSpaceOf(host); return book ? bookNames(book) : nameIndex(); };
