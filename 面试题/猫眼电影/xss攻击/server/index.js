var obj = {
  num: 2,
  adds: function () {
    this.num = 3;
    (function () {
      console.log(this.num);
      this.num = 4;
    })();
    console.log(this.num);
  }
};
obj.adds();

let baz = obj.adds;
baz()