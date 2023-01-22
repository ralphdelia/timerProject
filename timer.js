class Timer {
  constructor(min, sec, rounds, timeOff, incrementValueOn, incrementValueOff) {
    this.min = min;
    this.sec = sec;
    this.currentRound = 1;
    this.rounds = rounds;
    this.timeOff = timeOff;
    this.timeOnOffState = "on";
    this.state = "paused";
    this.interval = null;
    this.incrementValueOn = incrementValueOn;
    this.incrementValueOff = incrementValueOff;
    this.width = 0;
  }
  formatDisplay() {
    function zeroPad(number) {
      let string = String(number);
      while (string.length < 2) {
        string = "0" + string;
      }
      return string;
    }

    return `ROUND:${this.currentRound}/${this.rounds}   
        Time on:  ${zeroPad(this.min)}:${zeroPad(this.sec)}
        Time off:   00:${zeroPad(this.timeOff)}`;
  }

  resetBar() {
    this.width = 0;
  }
  resetVar() {
    if (this.round == this.currentRound) {
      clearInterval(this.interval);
      return;
    }
    this.currentRound += 1;
    this.min = storedVariables.min;
    this.sec = storedVariables.sec;
    this.timeOff = storedVariables.timeOff;
  }
  updateBar(timeOnOffValue) {
    if (this.width >= 100) {
      return;
    }
    this.width = this.width + timeOnOffValue;
  }

  deincrement() {
    if (this.timeOnOffState == "on") {
      if (this.sec == 0) {
        this.min--;
        this.sec = 59;
        this.updateBar(this.incrementValueOn);
      } else {
        this.sec--;
        this.updateBar(this.incrementValueOn);
      }
    }
    if (this.timeOnOffState == "off") {
      this.timeOff--;
      this.updateBar(this.incrementValueOff);
    }
  }
  updateTime() {
    //Last Round
    if (this.currentRound == this.rounds && this.timeOff == 0) {
      clearInterval(this.interval);
      return;
    }
    //On to Off
    if (this.timeOff == 0) {
      this.resetBar();
      this.resetVar();
      this.timeOnOffState = "on";
    }
    //From On state to Off State
    if (this.min == 0 && this.sec == 0) {
      if (this.timeOnOffState == "on") {
        this.resetBar();
      }
      this.timeOnOffState = "off";
    }

    this.deincrement();
    document.getElementById("timer").innerHTML = this.formatDisplay();
    document.getElementById("myBar").style.width = this.width + "%";
  }

  start() {
    if (this.state == "running") {
      return;
    } else {
      this.state = "running";
    }
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  stop() {
    this.state = "paused";
    clearInterval(this.interval);
  }

  reset() {
    clearInterval(this.interval);
    this.resetBar();
    this.currentRound = 1;
    this.min = storedVariables.min;
    this.sec = storedVariables.sec;
    this.timeOff = storedVariables.timeOff;
    this.timeOnOffState = "on";

    document.getElementById("timer").innerHTML = this.formatDisplay();
  }
}

function validateSet() {
  var x = document.getElementById("timeOff").value;
  if (x == "" || x == 0) {
    document.getElementById("timer").innerHTML = "Time off required!";
    return false;
  }
  return set();
}

let timer;
let storedVariables = {};

function set() {
  let min = document.getElementById("min").value;
  storedVariables.min = min;

  let sec = document.getElementById("sec").value;
  storedVariables.sec = sec;

  let totalSeconds = min * 60 + sec;
  let incrementValueOn = 100 / totalSeconds;

  let rounds = document.getElementById("rounds").value;
  storedVariables.rounds = rounds;

  let timeOff = document.getElementById("timeOff").value;
  storedVariables.timeOff = timeOff;

  let incrementValueOff = 100 / timeOff;

  if (rounds == 0) {
    storedVariables.rounds = 1;
    rounds = 1;
  }

  return (
    (timer = new Timer(
      min,
      sec,
      rounds,
      timeOff,
      incrementValueOn,
      incrementValueOff
    )),
    (document.getElementById("timer").innerHTML = timer.formatDisplay())
  );
}
