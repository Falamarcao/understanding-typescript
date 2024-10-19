// type AddFn = (a: number, b: number) => number; // Option 1
interface AddFn {
  // Alternative to Custom Type (Option 1)
  (a: number, b: number): number;
}

let addition: AddFn;

addition = (n1: number, n2: number) => n1 + n2;

interface Named {
  readonly name: string;
  lastName?: string; // `?` the question mark sets the property, parameters or methods as optional.
}

interface Greetable extends Named {
  // We can have multiple interfaces after `extends` separated by commas.
  greet(phrase: string): void;

  optionalMethod?(x: unknown): void; // `?` optional method
}

class Person implements Greetable {
  // We can have multiple interfaces after `implements` separated by commas.
  name: string;
  age?: number; // `?` optional parameter

  constructor(name: string, age?: number) {
    this.name = name;
    this.age = age;
  }

  greet(phrase: string): void {
    phrase = `${phrase} ${this.name}.`;
    if (this.age) {
      phrase += ` I have ${this.age} years old.`;
    }

    console.log(phrase);
  }
}

let user1: Greetable;

user1 = new Person('John', 40);

// user1.name = 'Anna'; // readonly was defined in the `interface`.
// error TS2540: Cannot assign to 'name' because it is a read-only property.

user1.greet('Hello, my name is');
console.log(user1);

let user2: Greetable;
user2 = new Person('Anna');
user2.greet('Hello everybody, my name is');
console.log(user2);
