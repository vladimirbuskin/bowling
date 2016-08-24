class ElementMock {

  appendChild() {

  }

  removeChild() {

  }

  addEventListener() {

  }

  removeEventListener() {

  }

  setAttribute() {

  }
}

class ElementNSMock extends ElementMock {

  setAttribute() {

  }
}

class DocumentMock {

  constructor() {
    this.documentElement = {};
  }

  getElementById() {
    return new ElementMock();
  }

  createElement() {
    return new ElementMock();
  }

  createElementNS() {
    return new ElementNSMock();
  }
}

global.document = new DocumentMock();