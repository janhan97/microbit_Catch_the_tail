function right () {
    DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 회전속도)
    DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 회전속도)
    basic.pause(300)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    allstop()
})
function 이미지인식 () {
    if (1 <= 인식된값 && 인식된값 <= 5) {
        if (체크 == 0) {
            체크 = 1
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.GREEN)
            점수 += 1
            if (인식된값 == 상대팀대장) {
                radio.sendString(상대팀)
                점수 += 1
                basic.showIcon(IconNames.Heart)
            }
            radio.sendString("" + 상대팀 + 인식된값)
        }
        따라가기()
    } else {
        DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
        체크 = 0
    }
}
function left () {
    DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CCW, 회전속도)
    DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CW, 회전속도)
    basic.pause(300)
}
function fast () {
    속도 = 속도 + 10
    회전속도 = 회전속도 + 5
}
input.onButtonPressed(Button.A, function () {
    fast()
})
function info () {
    huskylens.request()
    거리 = DFRobotMaqueenPlus.ultraSonic(PIN.P0, PIN.P1)
    huskylens.writeOSD(convertToText(거리), 15, 76)
    huskylens.writeOSD(convertToText(DFRobotMaqueenPlus.readSpeed(Motors1.M2)), 15, 122)
    huskylens.writeOSD(convertToText(점수), 270, 56)
    인식된값 = huskylens.readBox_s(Content3.ID)
}
input.onButtonPressed(Button.AB, function () {
    reset()
})
function slow () {
    속도 = 속도 - 10
    회전속도 = 회전속도 - 5
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "allstop") {
        allstop()
    } else if (receivedString == "fast") {
        fast()
    } else if (receivedString == "slow") {
        slow()
    } else {
        if (receivedString == "" + 우리팀 + 나의팀번호) {
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.RED)
            점수 = 점수 - 1
            if (receivedString == "" + 우리팀 + 우리팀대장) {
                점수 = 점수 - 1
            }
            basic.showIcon(IconNames.No)
            timestop()
            basic.clearScreen()
            속도 = 50
            회전속도 = 50
        } else {
            DFRobotMaqueenPlus.setRGBLight(RGBLight.RGBA, Color.OFF)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    slow()
})
function timestop () {
    allstop()
    basic.pause(3000)
}
function allstop () {
    속도 = 0
    회전속도 = 0
}
function teamset () {
    라디오그룹 = 1
    상대팀 = "blue"
    우리팀 = "red"
    나의팀번호 = 1
    우리팀대장 = 2
    상대팀대장 = 3
}
function reset () {
    인식된값 = 0
    점수 = 0
    속도 = 50
    회전속도 = 50
    체크 = 0
}
function 따라가기 () {
    if (180 < huskylens.readeBox(인식된값, Content1.xCenter)) {
        DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 속도 + (huskylens.readeBox(인식된값, Content1.xCenter) - 180))
        DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CW, 0)
        basic.pause(200)
    } else {
        if (90 > huskylens.readeBox(인식된값, Content1.xCenter)) {
            DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CW, 속도 + (80 - huskylens.readeBox(인식된값, Content1.xCenter)))
            DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 0)
            basic.pause(200)
        }
    }
}
let 우리팀대장 = 0
let 나의팀번호 = 0
let 우리팀 = ""
let 거리 = 0
let 속도 = 0
let 상대팀 = ""
let 상대팀대장 = 0
let 점수 = 0
let 체크 = 0
let 인식된값 = 0
let 회전속도 = 0
let 라디오그룹 = 0
teamset()
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
huskylens.clearOSD()
huskylens.writeOSD("s:", 0, 122)
huskylens.writeOSD("d:", 0, 76)
huskylens.writeOSD("P:", 250, 56)
reset()
radio.setGroup(라디오그룹)
radio.setTransmitPower(7)
led.stopAnimation()
basic.forever(function () {
    info()
    이미지인식()
    if (DFRobotMaqueenPlus.readSpeed(Motors1.M1) < 70 || DFRobotMaqueenPlus.readSpeed(Motors1.M2) < 70) {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CCW, 속도)
        basic.pause(600)
        DFRobotMaqueenPlus.mototRun(Motors.M1, Dir.CW, 속도)
        DFRobotMaqueenPlus.mototRun(Motors.M2, Dir.CCW, 속도)
        basic.pause(300)
    }
    if (거리 < 15) {
        if (101 == randint(101, 102)) {
            right()
        } else {
            left()
        }
    } else {
        DFRobotMaqueenPlus.mototRun(Motors.ALL, Dir.CW, 속도)
    }
})
