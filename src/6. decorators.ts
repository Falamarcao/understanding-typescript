//
// Decorators
//

function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Human {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const human = new Human();

console.log(human);

//
// Decorator Factories
//

// Decorator Factory
function Logger_decorator_factory(logString: string) {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log('Rendering template');
    console.log(logString);
    console.log(constructor);
  };
}

@Logger_decorator_factory('Logging - Human2')
class Human2 {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const human2 = new Human();

console.log(human2);

//
// Building More Usefil Decorators
//

// function WithTemplate(template: string, hookId: string) { // Decorator Factory
//     return function (_: Function) { // `_` shows typescript that we are not using the parameter.
//         const hookElement = document.getElementById(hookId);
//         if (hookElement) {
//             hookElement.innerHTML = template;
//         }
//     }
// }

function WithTemplate(template: string, hookId: string) {
  // Decorator Factory
  console.log('TEMPLATE FACTORY');
  return function (constructor: any) {
    console.log('Rendering template');
    const hookElement = document.getElementById(hookId);
    const value = new constructor();
    if (hookElement) {
      hookElement.innerHTML = template;
      hookElement.innerHTML += `<p>${value.name}</p>`;
    }
  };
}

@Logger_decorator_factory('Logging - Human3') // We can add multiple decorators!
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Human3 {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const human3 = new Human();

console.log(human3);

//
// Property Decorators
// Accessor & Parameter Decorators
//
// *These decorators execute when the class is defined. (Not when is instantiated!)
//

function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator');
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Acessor decorator');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log('Method decorator');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive.');
    }
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

//
// Returning and changing a Class in a Class decorator
//

function WithTemplate2(template: string, hookId: string) {
  // Decorator Factory
  console.log('TEMPLATE FACTORY');
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      // replaces the original class retuning a new class with a new constructor.
      constructor(..._: any[]) {
        super();

        console.log('Rendering template');
        const hookElement = document.getElementById(hookId);

        if (hookElement) {
          hookElement.innerHTML = template;
          hookElement.innerHTML += `<p>${this.name}</p>`;
        }
      }
    };
  };
}

@WithTemplate2('<h1>My Human 4</h1>', 'app')
class Human4 {
  name = 'Julia';

  constructor() {
    console.log('Creating person object...');
  }
}

const human4 = new Human4(); // logic inside the decorator's constructor will be executed when the class is instantiated.

//
// Other Decorator Return Types
//

// Decorators that can return a value are decorators attached to methods and accessors.
// Decorators on properties and parameters can return values, but TypeScript will ingore it (not will be used).

//
// Creating an Autobind Decorator
//

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const ourDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return ourDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();

const button = document.querySelector('button')!;
// button.addEventListener('click', printer.showMessage.bind(printer));
button.addEventListener('click', printer.showMessage); // using AutoBind decorator

//
// Validation with Decorators
//

enum ValidationOptions {
  REQUIRED = 'required',
  POSITIVE = 'positive',
}

interface ValidatorConfig {
  [propery: string]: {
    [validatableProp: string]: ValidationOptions[];
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [
      ...(registeredValidators[target.constructor.name]?.[propertyName] ?? []),
      ValidationOptions.REQUIRED,
    ],
  };
}

function PositiveNumber(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [
      ...(registeredValidators[target.constructor.name]?.[propertyName] ?? []),
      ValidationOptions.POSITIVE,
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];

  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case ValidationOptions.REQUIRED:
          isValid = isValid && !!obj[prop];
          break;
        case ValidationOptions.POSITIVE:
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;

  @PositiveNumber
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleInput = document.getElementById('title') as HTMLInputElement;
  const priceInput = document.getElementById('price') as HTMLInputElement;

  const title = titleInput.value;
  const price = +priceInput.value; // the `+` convert string to number.

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }

  console.log(createdCourse);
});
