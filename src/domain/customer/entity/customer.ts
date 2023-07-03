import EventDispatcher from '../../@shared/event/event-dispatcher';
import CustomerChangeAddressEvent from '../event/customer-change-address/customer-change-address.event';
import CustomerChangeAddressEventHandler from '../event/customer-change-address/handler/customer-change-address.handler';
import CustomerCreatedEvent from '../event/customer-created/customer-created.event';
import EnviaConsoleLog1Handler from '../event/customer-created/handler/customer-created1.handler';
import EnviaConsoleLog2Handler from '../event/customer-created/handler/customer-created2.handler';
import Address from '../value-object/address';

const dispatcher = new EventDispatcher();
dispatcher.register('CustomerCreatedEvent', new EnviaConsoleLog1Handler());
dispatcher.register('CustomerCreatedEvent', new EnviaConsoleLog2Handler());
dispatcher.register(
  'CustomerChangeAddressEvent',
  new CustomerChangeAddressEventHandler()
);

export default class Customer {
  private _id: string;
  private _name: string = '';
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    dispatcher.notify(new CustomerCreatedEvent(this));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('Id is required');
    }
    if (this._name.length === 0) {
      throw new Error('Name is required');
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    dispatcher.notify(new CustomerChangeAddressEvent(this));
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('Address is mandatory to activate a customer');
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
