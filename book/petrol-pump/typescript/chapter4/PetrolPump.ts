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
import Inputs from "../pump/inputs";
import images from "./Images";
import sounds from "./Sounds";
import SComboBox from "../pump/SComboBox";
import STextField from "../pump/STextField";
import SButton from "../pump/SButton";
import AccumulatePulsesPump from "./section6/AccumulatePulsesPump";
import Formatters from "../pump/formatters";
import ShowDollarsPump from "./section7/ShowDollarsPump";

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

    const presetLCDDiv = document.createElement("div");
    this.presetLCD.listen((text) => {
      PumpFace.drawSegments(193, 140, text, this.largeImgs, 5, presetLCDDiv);
    });
    document.body.appendChild(presetLCDDiv);
    const saleCostLCDDiv = document.createElement("div");
    this.saleCostLCD.listen((text) => {
      PumpFace.drawSegments(517, 30, text, this.largeImgs, 5, saleCostLCDDiv);
    });
    document.body.appendChild(saleCostLCDDiv);
    const saleQuantityLCDDiv = document.createElement("div");
    this.saleQuantityLCD.listen((text) => {
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
    const priceLCD1Div = document.createElement("div");
    this.priceLCD1.listen((text) => {
      PumpFace.drawSegments(355, 230, text, this.smallImgs, 5, priceLCD1Div);
    });
    document.body.appendChild(priceLCD1Div);
    const priceLCD2Div = document.createElement("div");
    this.priceLCD2.listen((text) => {
      PumpFace.drawSegments(485, 230, text, this.smallImgs, 5, priceLCD2Div);
    });
    document.body.appendChild(priceLCD2Div);
    const priceLCD3Div = document.createElement("div");
    this.priceLCD3.listen((text) => {
      PumpFace.drawSegments(615, 230, text, this.smallImgs, 5, priceLCD3Div);
    });
    document.body.appendChild(priceLCD3Div);

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
            case Delivery.FAST1:
            case Delivery.FAST2:
            case Delivery.FAST3:
              view.sFuelPulses.send(40);
              break;
            case Delivery.SLOW1:
            case Delivery.SLOW2:
            case Delivery.SLOW3:
              view.sFuelPulses.send(2);
              break;
          }
        }),
      200
    );
  }

  constructor() {
    const logicDiv = document.createElement("div");
    logicDiv.style.position = "absolute";
    logicDiv.style.top = "500px";
    const logicLabel = document.createElement("label");
    logicLabel.innerText = "logic";
    logicLabel.style.paddingRight = "20px";
    logicDiv.appendChild(logicLabel);
    const logicComboBox = new SComboBox<Pump>({
      items: [
        new LifeCyclePump(),
        new AccumulatePulsesPump(),
        new ShowDollarsPump(),
      ],
    });
    logicDiv.appendChild(logicComboBox.getHTMLElement());
    document.body.appendChild(logicDiv);

    const priceDiv = document.createElement("div");
    priceDiv.style.position = "absolute";
    priceDiv.style.top = "530px";
    const price1Label = document.createElement("label");
    price1Label.innerText = "price1";
    price1Label.style.paddingRight = "20px";
    priceDiv.appendChild(price1Label);
    const textPrice1 = new STextField({ initText: "2.149", width: 7 });
    priceDiv.appendChild(textPrice1.getHTMLElement());
    const price2Label = document.createElement("label");
    price2Label.innerText = "price2";
    price2Label.style.paddingLeft = "20px";
    price2Label.style.paddingRight = "20px";
    priceDiv.appendChild(price2Label);
    const textPrice2 = new STextField({ initText: "2.341", width: 7 });
    priceDiv.appendChild(textPrice2.getHTMLElement());
    const price3Label = document.createElement("label");
    price3Label.innerText = "price3";
    price3Label.style.paddingLeft = "20px";
    price3Label.style.paddingRight = "20px";
    priceDiv.appendChild(price3Label);
    const textPrice3 = new STextField({ initText: "1.499", width: 7 });
    priceDiv.appendChild(textPrice3.getHTMLElement());
    document.body.appendChild(priceDiv);

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
    const price1 = textPrice1.text.map(parseDbl);
    const price2 = textPrice2.text.map(parseDbl);
    const price3 = textPrice3.text.map(parseDbl);
    const csClearSale = new CellSink<Stream<Unit>>(new Stream<Unit>());
    const sClearSale = Cell.switchS(csClearSale);

    const outputs = logicComboBox.selectedItem.map((pump) =>
      pump.create(
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

    const beepClip = document.createElement("audio");
    beepClip.src = sounds.get("beep");
    beepClip.loop = true;
    sBeep.listen((u) => {
      beepClip.play();
    });
    const fastRumble = document.createElement("audio");
    fastRumble.src = sounds.get("fast");
    fastRumble.loop = true;
    const slowRumble = document.createElement("audio");
    slowRumble.src = sounds.get("slow");
    slowRumble.loop = true;
    Operational.value(this.delivery)
      .snapshot(this.delivery, (neu, old) => (old == neu ? undefined : neu))
      .filter((u) => u !== undefined)
      .listen((d) => {
        switch (d) {
          case Delivery.FAST1:
          case Delivery.FAST2:
          case Delivery.FAST3:
            fastRumble.play();
            break;
          default:
            fastRumble.pause();
        }
        switch (d) {
          case Delivery.SLOW1:
          case Delivery.SLOW2:
          case Delivery.SLOW3:
            slowRumble.play();
            break;
          default:
            slowRumble.pause();
        }
      });

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

    const dialog = document.createElement("dialog");
    const message = document.createElement("div");
    dialog.appendChild(message);
    const button = new SButton({ label: "OK" });
    csClearSale.send(button.sClicked);
    button.sClicked.listen((u) => {
      dialog.close();
    });
    dialog.appendChild(button.getHTMLElement());
    document.body.appendChild(dialog);
    sSaleComplete.listen((sale) => {
      message.innerText = `Fuel ${sale.fuel.toString()}\nPrice ${Formatters.priceFmt.format(
        sale.price
      )}\nDollars delivered ${Formatters.costFmt.format(
        sale.cost
      )}\nLiters delivered ${Formatters.quantityFmt.format(sale.quantity)}`;
      dialog.show();
    });
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
