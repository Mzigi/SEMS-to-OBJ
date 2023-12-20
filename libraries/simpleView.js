"use-strict";
// @ts-check
var simpleView = /** @class */ (function () {
    function simpleView(buffer) {
        this.view = new DataView(buffer);
        this.viewOffset = 0;
    }
    simpleView.prototype.readUtf8String = function () {
        var stringLength = this.readUint32();
        var stringBuffer = this.view.buffer.slice(this.viewOffset, this.viewOffset + stringLength);
        var string = new TextDecoder().decode(stringBuffer);
        this.viewOffset += stringLength;
        return string;
    };
    simpleView.prototype.writeFloat32 = function (value, littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        value = Math.max(value, -340282346638528859811704183484516925440.0);
        value = Math.min(value, 340282346638528859811704183484516925440.0);
        this.view.setFloat32(this.viewOffset, value, littleEdian);
        this.viewOffset += 4;
    };
    simpleView.prototype.readFloat32 = function (littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        var value = this.view.getFloat32(this.viewOffset, littleEdian);
        this.viewOffset += 4;
        return value;
    };
    simpleView.prototype.writeInt32 = function (value, littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        value = Math.max(value, -2147483648);
        value = Math.min(value, 2147483647);
        this.view.setInt32(this.viewOffset, value, littleEdian);
        this.viewOffset += 4;
    };
    simpleView.prototype.readInt32 = function (littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        var value = this.view.getInt32(this.viewOffset, littleEdian);
        this.viewOffset += 4;
        return value;
    };
    simpleView.prototype.writeUint32 = function (value, littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        value = Math.max(value, 0);
        value = Math.min(value, 4294967295);
        this.view.setUint32(this.viewOffset, value, littleEdian);
        this.viewOffset += 4;
    };
    simpleView.prototype.readUint32 = function (littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        var value = this.view.getUint32(this.viewOffset, littleEdian);
        this.viewOffset += 4;
        return value;
    };
    simpleView.prototype.writeInt16 = function (value, littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        value = Math.max(value, -32768);
        value = Math.min(value, 32767);
        this.view.setInt16(this.viewOffset, value, littleEdian);
        this.viewOffset += 2;
    };
    simpleView.prototype.readInt16 = function (littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        var value = this.view.getInt16(this.viewOffset, littleEdian);
        this.viewOffset += 2;
        return value;
    };
    simpleView.prototype.writeUint16 = function (value, littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        value = Math.max(value, 0);
        value = Math.min(value, 65535);
        this.view.setUint16(this.viewOffset, value, littleEdian);
        this.viewOffset += 2;
    };
    simpleView.prototype.readUint16 = function (littleEdian) {
        if (!littleEdian) {
            littleEdian = true;
        }
        var value = this.view.getUint16(this.viewOffset, littleEdian);
        this.viewOffset += 2;
        return value;
    };
    simpleView.prototype.writeInt8 = function (value) {
        value = Math.max(value, -128);
        value = Math.min(value, 127);
        this.view.setInt8(this.viewOffset, value);
        this.viewOffset += 1;
    };
    simpleView.prototype.readInt8 = function () {
        var value = this.view.getInt8(this.viewOffset);
        this.viewOffset += 1;
        return value;
    };
    simpleView.prototype.writeUint8 = function (value) {
        value = Math.max(value, 0);
        value = Math.min(value, 255);
        this.view.setUint8(this.viewOffset, value);
        this.viewOffset += 1;
    };
    simpleView.prototype.readUint8 = function () {
        var value = this.view.getUint8(this.viewOffset);
        this.viewOffset += 1;
        return value;
    };
    return simpleView;
}());
//# sourceMappingURL=simpleView.js.map