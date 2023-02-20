import {
  Cell,
  CellLoop,
  CellSink,
  Operational,
  Stream,
  StreamSink,
  Transaction,
  Tuple2,
  Unit,
} from "sodiumjs";
import Delivery from "../pump/delivery";
import Key from "../pump/key";
import UpDown from "../pump/updown";
import Pump from "../pump/pump";
import LifeCyclePump from "./section4/LifeCyclePump";
import Outputs from "../pump/outputs";
import Inputs from "../pump/inputs";
import images from "./Images";

class Rectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(p: Point) {
    return (
      this.x <= p.x &&
      p.x <= this.x + this.width &&
      this.y <= p.y &&
      p.y <= this.y + this.height
    );
  }
}

class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class PumpFace {
  private readonly backgroundImg: string;
  private readonly smallImgs = new Array<string>(8);
  private readonly largeImgs = new Array<string>(8);
  private readonly nozzleImgs = new Array<string>(3);
  private readonly presetLCD: Cell<number[]>;
  private readonly saleCostLCD: Cell<number[]>;
  private readonly saleQuantityLCD: Cell<number[]>;
  private readonly priceLCD1: Cell<number[]>;
  private readonly priceLCD2: Cell<number[]>;
  private readonly priceLCD3: Cell<number[]>;
  private readonly nozzles = new Array<Cell<UpDown>>(3);
  public readonly nozzleRects = new Array<Cell<Rectangle>>(3);

  constructor(
    sClick: StreamSink<Point>,
    presetLCD: Cell<number[]>,
    saleCostLCD: Cell<number[]>,
    saleQuantityLCD: Cell<number[]>,
    priceLCD1: Cell<number[]>,
    priceLCD2: Cell<number[]>,
    priceLCD3: Cell<number[]>,
    nozzle1: Cell<UpDown>,
    nozzle2: Cell<UpDown>,
    nozzle3: Cell<UpDown>
  ) {
    this.presetLCD = presetLCD;
    this.saleCostLCD = saleCostLCD;
    this.saleQuantityLCD = saleQuantityLCD;
    this.priceLCD1 = priceLCD1;
    this.priceLCD2 = priceLCD2;
    this.priceLCD3 = priceLCD3;
    this.nozzles[0] = nozzle1;
    this.nozzles[1] = nozzle2;
    this.nozzles[2] = nozzle3;

    this.backgroundImg = images.get("background");
    const backgroundElement = document.createElement("img");
    backgroundElement.src = this.backgroundImg;
    backgroundElement.style.position = "absolute";
    backgroundElement.style.top = "0px";
    backgroundElement.style.left = "0px";
    document.body.appendChild(backgroundElement);

    for (let i = 0; i < 8; i++) {
      this.smallImgs[i] = images.get(`small${i}`);
      this.largeImgs[i] = images.get(`large${i}`);
    }

    const saleQuantityLCDDiv = document.createElement("div");
    saleQuantityLCD.listen((text) => {
      PumpFace.drawSegments(
        517,
        120,
        text,
        this.largeImgs,
        5,
        saleQuantityLCDDiv
      );
    });
    document.body.appendChild(saleQuantityLCDDiv);

    for (let i = 0; i < 3; i++) {
      this.nozzleImgs[i] = images.get(`nozzle${i + 1}`);
      const nozzleElement = document.createElement("img");
      nozzleElement.src = this.nozzleImgs[i];
      nozzleElement.style.position = "absolute";
      nozzleElement.style.top = "330px";
      nozzleElement.style.left = (270 + i * 130).toString() + "px";
      this.nozzles[i].listen((upDown) => {
        if (upDown == UpDown.UP) {
          nozzleElement.style.top = "300px";
        }
        if (upDown == UpDown.DOWN) {
          nozzleElement.style.top = "330px";
        }
      });
      nozzleElement.addEventListener("click", (event: MouseEvent) => {
        sClick.send(new Point(event.x, event.y));
      });
      this.nozzleRects[i] = this.nozzles[i].map(
        (upDown) =>
          new Rectangle(270 + i * 130, upDown == UpDown.UP ? 300 : 330, 90, 160)
      );
      document.body.appendChild(nozzleElement);
    }
  }

  public static drawSegments(
    ox: number,
    oy: number,
    digits: number[],
    images: string[],
    noOfDigits: number,
    div: HTMLDivElement
  ) {
    while (div.firstChild) {
      div.removeChild(div.lastChild);
    }
    for (let i = 0; i < digits.length && i < noOfDigits; i++) {
      const x = ox - 25 * (i + 1);
      const digit = digits[digits.length - 1 - i];
      for (let j = 0; j < 8; j++) {
        if ((digit & (1 << j)) != 0) {
          const digitElement = document.createElement("img");
          digitElement.src = images[j];
          digitElement.style.position = "absolute";
          digitElement.style.top = oy.toString() + "px";
          digitElement.style.left = x.toString() + "px";
          div.appendChild(digitElement);
        }
      }
    }
  }
}

class PetrolPump {
  public readonly sKey: Stream<Key>;
  public readonly sFuelPulses = new StreamSink<number>();
  public readonly delivery: Cell<Delivery>;

  public static main() {
    const view = new PetrolPump();
    setInterval(
      () =>
        Transaction.run(() => {
          switch (view.delivery.sample()) {
            case (Delivery.FAST1, Delivery.FAST2, Delivery.FAST3):
              view.sFuelPulses.send(40);
              break;
            case (Delivery.SLOW1, Delivery.SLOW2, Delivery.SLOW3):
              view.sFuelPulses.send(2);
              break;
          }
        }),
      200
    );
  }

  constructor() {
    // FIXME: add logic selection
    const logic: Pump = new LifeCyclePump();

    // TOOD: add textfields for price

    const parseDbl = (str: string) => Number(str) || 0.0;

    const sClick = new StreamSink<Point>();
    this.sKey = PetrolPump.toKey(sClick);

    const five = [0xff, 0xff, 0xff, 0xff, 0xff];
    const four = [0xff, 0xff, 0xff, 0xff];
    const nozzles = new Array<CellLoop<UpDown>>(3);
    for (let i = 0; i < 3; i++) {
      nozzles[i] = new CellLoop<UpDown>();
    }

    const calibration = new Cell<number>(0.001);
    // FIXME: use input textfields
    const price1 = new Cell<number>(2.149);
    const price2 = new Cell<number>(2.341);
    const price3 = new Cell<number>(1.499);
    const csClearSale = new CellSink<Stream<Unit>>(new Stream<Unit>());
    const sClearSale = Cell.switchS(csClearSale);

    const outputs = new Cell<Outputs>(
      logic.create(
        new Inputs(
          Operational.updates(nozzles[0]),
          Operational.updates(nozzles[1]),
          Operational.updates(nozzles[2]),
          this.sKey,
          this.sFuelPulses,
          calibration,
          price1,
          price2,
          price3,
          sClearSale
        )
      )
    );

    this.delivery = Cell.switchC(outputs.map((o) => o.delivery));
    const presetLCD = Cell.switchC(outputs.map((o) => o.presetLCD));
    const saleCostLCD = Cell.switchC(outputs.map((o) => o.saleCostLCD));
    const saleQuantityLCD = Cell.switchC(outputs.map((o) => o.saleQuantityLCD));
    const priceLCD1 = Cell.switchC(outputs.map((o) => o.priceLCD1));
    const priceLCD2 = Cell.switchC(outputs.map((o) => o.priceLCD2));
    const priceLCD3 = Cell.switchC(outputs.map((o) => o.priceLCD3));
    const sBeep = Cell.switchS(outputs.map((o) => o.sBeep));
    const sSaleComplete = Cell.switchS(outputs.map((o) => o.sSaleComplete));

    // TODO: add sounds

    const face = new PumpFace(
      sClick,
      PetrolPump.format7Seg(presetLCD, 5),
      PetrolPump.format7Seg(saleCostLCD, 5),
      PetrolPump.format7Seg(saleQuantityLCD, 5),
      PetrolPump.format7Seg(priceLCD1, 4),
      PetrolPump.format7Seg(priceLCD2, 4),
      PetrolPump.format7Seg(priceLCD3, 4),
      nozzles[0],
      nozzles[1],
      nozzles[2]
    );
    for (let i = 0; i < 3; i++) {
      const rectState = face.nozzleRects[i].lift(
        nozzles[i],
        (rect, state) => new Tuple2<Rectangle, UpDown>(rect, state)
      );
      nozzles[i].loop(
        sClick
          .snapshot(rectState, (pt, rs) =>
            rs.a.contains(pt) ? PetrolPump.invert(rs.b) : undefined
          )
          .filter((u) => u !== undefined)
          .hold(UpDown.DOWN)
      );
    }

    // TODO: add dialog
  }

  private static format7Seg(
    text: Cell<string>,
    digits: number
  ): Cell<number[]> {
    return text.map((text_) => {
      const segs = new Array<number>(digits);
      for (let i = 0; i < digits; i++) {
        segs[i] = 0;
      }
      let i = digits - 1;
      let j = text_.length - 1;
      while (j >= 0 && i >= 0) {
        const ch = text_[j];
        switch (ch) {
          case "-":
            segs[i] |= 0x08;
            i--;
            break;
          case "0":
            segs[i] |= 0x77;
            i--;
            break;
          case "1":
            segs[i] |= 0x24;
            i--;
            break;
          case "2":
            segs[i] |= 0x6b;
            i--;
            break;
          case "3":
            segs[i] |= 0x6d;
            i--;
            break;
          case "4":
            segs[i] |= 0x3c;
            i--;
            break;
          case "5":
            segs[i] |= 0x5d;
            i--;
            break;
          case "6":
            segs[i] |= 0x5f;
            i--;
            break;
          case "7":
            segs[i] |= 0x64;
            i--;
            break;
          case "8":
            segs[i] |= 0x7f;
            i--;
            break;
          case "9":
            segs[i] |= 0x7c;
            i--;
            break;
          case ".":
            segs[i] |= 0x80;
            break;
        }
        j--;
      }

      return segs;
    });
  }

  private static invert(u: UpDown): UpDown {
    return u == UpDown.UP ? UpDown.DOWN : UpDown.UP;
  }

  public static toKey(sClick: Stream<Point>): Stream<Key> {
    const keys = new Map<Tuple2<number, number>, Key>();
    keys.set(new Tuple2(0, 0), Key.ONE);
    keys.set(new Tuple2(1, 0), Key.TWO);
    keys.set(new Tuple2(2, 0), Key.THREE);
    keys.set(new Tuple2(0, 1), Key.FOUR);
    keys.set(new Tuple2(1, 1), Key.FIVE);
    keys.set(new Tuple2(2, 1), Key.SIX);
    keys.set(new Tuple2(0, 2), Key.SEVEN);
    keys.set(new Tuple2(1, 2), Key.EIGHT);
    keys.set(new Tuple2(2, 2), Key.NINE);
    keys.set(new Tuple2(1, 3), Key.ZERO);
    keys.set(new Tuple2(2, 3), Key.CLEAR);

    return sClick.map((pt) => {
      const x = pt.x - 40;
      const y = pt.y - 230;
      const col = x / 50;
      const row = y / 50;
      const valid =
        x >= 0 && x % 50 < 40 && y >= 0 && y % 50 < 40 && col < 3 && row < 4;
      const key = valid ? keys.get(new Tuple2(col, row)) : undefined;
      return key;
    });
  }
}

Transaction.run(() => PetrolPump.main());
