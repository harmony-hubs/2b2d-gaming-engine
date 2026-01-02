import Component from "../../2B2D/Components/Component";

export default class PianoKey implements Component {
  static readonly NAME: string = 'PianoKey';
  readonly name: string = PianoKey.NAME;

  constructor(
    public note: string,
    public frequency: number,
    public key: string,
    public isPressed: boolean = false
  ) {
  }
}
