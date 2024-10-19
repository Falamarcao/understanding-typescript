//
// Intersection Types
//

// OPTION 1:

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee; // Intersection Types

// OPTION 2:

interface Admin_ {
  name: string;
  privileges: string[];
}

interface Employee_ {
  name: string;
  startDate: Date;
}

interface ElevatedEmployee_ extends Employee_, Admin_ {}

type ElevatedEmployee__ = Admin_ & Employee_; // Intersection Types

const e1: ElevatedEmployee = {
  name: 'John',
  privileges: ['write-database'],
  startDate: new Date(),
};

type Combinable = string | number;
type Numberic = number | boolean;

type Universal = Combinable & Numberic;

//
// Type Guards
//

function combine(a: Combinable, b: Combinable) {
  // Type Guard:
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin; // this can be a Employee type or Admin type

function printEmployeeInformation(employee: UnknownEmployee) {
  console.log('Name: ' + employee.name);
  // Type Guard:
  if ('privileges' in employee) {
    console.log('Privileges: ' + employee.privileges);
  }
  // Type Guard:
  if ('startDate' in employee) {
    console.log('Start Date: ' + employee.startDate);
  }
}

printEmployeeInformation(e1);

// Discriminated Unions

class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo... ' + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  // Type Guard:

  // Option 1:
  // if ('loadCargo' in vehicle) {
  //   vehicle.loadCargo(1000);
  // }

  // Option 2:
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  // if ('flyingSpeed' in animal) { // One way, but lead to many if statatments
  //   console.log('Moving with speed: ' + animal.flyingSpeed);
  // }

  // if ('flyingSpeed' in Bird) { // this dont' because Bird is a interface and doesn't compiles to JS code, and on runtime won't be available.
  //   console.log('Moving with speed: ' + animal.flyingSpeed);
  // }

  let speed;

  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
  }
  console.log('Moving with speed: ' + speed);
}

moveAnimal({ type: 'bird', flyingSpeed: 100 });
moveAnimal({ type: 'horse', runningSpeed: 100 });

//
// Type Casting
//

// Option 1:
const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')!
);
userInputElement.value = 'Hello World';

// Option 2:
const userInputElement_2 = document.getElementById(
  'user-input'
)! as HTMLInputElement; // the `!` exclamation point turns off the null checking, we know that this exists in our HTML.
userInputElement_2.value = 'Hello World';

//Option 3:
const userInputElement_3 = document.getElementById('user-input');

if (userInputElement_3) {
  (userInputElement_3 as HTMLInputElement).value = 'Hello World';
}

//
// Index Properties
//

interface ErrorContainer {
  // id: string; // the `id` can't be type number, because the index property `[prop: string]: string` is a string. They must be the same datatype.
  [prop: string]: string; // { email: 'Not a valid email.'} or { username: 'Must start with a letter.' }'}
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email.',
  username: 'Must start with a letter.',
};

//
// Functions Overloads
//

// Helps with TypeScript intellisense
// TypeScript knowing what methods can be called from the result.
function comb(a: number, b: number): number;
function comb(a: string, b: string): string;
function comb(a: string, b: number): string;
function comb(a: number, b: string): string;
function comb(a: Combinable, b: Combinable) {
  // Type Guard:
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = comb('Max ', 'Schwarz');
result.split(' ');

const result2 = comb(1, 41);
result2.toString();

//
// Optional Chaining
//

const fetchedUserData = {
  id: 'uuud1',
  name: 'Julia',
  job: { title: 'CEO', description: 'The boss' },
};

console.log(fetchedUserData?.job?.title); // Null safety - if the fetchedUserData cames from a Web API.

//
// Nullish Coalescing
//

let userInput = null;
let storedData = userInput || 'DEFAULT'; // null is false. Stores DEFAULT.
console.log(1, storedData);

userInput = undefined;
storedData = userInput || 'DEFAULT'; // null is false. Stores DEFAULT.
console.log(2, storedData);

userInput = '';
storedData = userInput || 'DEFAULT'; // empty string is false. Stores DEFAULT.
console.log(3, storedData);

userInput = undefined;
storedData = userInput ?? 'DEFAULT'; // undefined is null. Stores DEFAULT.
console.log(4, storedData);

userInput = '';
storedData = userInput ?? 'DEFAULT'; // empty string is accepted, because is not null/undefined.
console.log(5, storedData);
