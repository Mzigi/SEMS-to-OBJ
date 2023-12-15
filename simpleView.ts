"use-strict";
// @ts-check

class simpleView {
    view: DataView
    viewOffset: number

    constructor (buffer: ArrayBuffer) {
        this.view = new DataView(buffer)
        this.viewOffset = 0
    }

    readUtf8String(): string {
        let stringLength = this.readUint32()
        let stringBuffer = this.view.buffer.slice(this.viewOffset, this.viewOffset + stringLength)
        let string = new TextDecoder().decode(stringBuffer)
        
        this.viewOffset += stringLength

        return string
    }

    writeFloat32(value: number, littleEdian?: boolean) {
        if (!littleEdian) {
            littleEdian = true
        }

        value = Math.max(value, -340282346638528859811704183484516925440.0)
        value = Math.min(value, 340282346638528859811704183484516925440.0)

        this.view.setFloat32(this.viewOffset, value, littleEdian)
        this.viewOffset += 4
    }

    readFloat32(littleEdian?: boolean): number {
        if (!littleEdian) {
            littleEdian = true
        }

        let value: number = this.view.getFloat32(this.viewOffset, littleEdian)
        this.viewOffset += 4
        
        return value
    }

    writeInt32(value: number, littleEdian?: boolean) {
        if (!littleEdian) {
            littleEdian = true
        }

        value = Math.max(value, -2147483648)
        value = Math.min(value, 2147483647)

        this.view.setInt32(this.viewOffset, value, littleEdian)
        this.viewOffset += 4
    }

    readInt32(littleEdian?: boolean): number {
        if (!littleEdian) {
            littleEdian = true
        }

        let value: number = this.view.getInt32(this.viewOffset, littleEdian)
        this.viewOffset += 4
        
        return value
    }

    writeUint32(value: number, littleEdian?: boolean) {
        if (!littleEdian) {
            littleEdian = true
        }

        value = Math.max(value, 0)
        value = Math.min(value, 4294967295)

        this.view.setUint32(this.viewOffset, value, littleEdian)
        this.viewOffset += 4
    }

    readUint32(littleEdian?: boolean): number {
        if (!littleEdian) {
            littleEdian = true
        }

        let value: number = this.view.getUint32(this.viewOffset, littleEdian)
        this.viewOffset += 4
        
        return value
    }

    writeInt16(value: number, littleEdian?: boolean) {
        if (!littleEdian) {
            littleEdian = true
        }

        value = Math.max(value, -32768)
        value = Math.min(value, 32767)

        this.view.setInt16(this.viewOffset, value, littleEdian)
        this.viewOffset += 2
    }

    readInt16(littleEdian?: boolean): number {
        if (!littleEdian) {
            littleEdian = true
        }

        let value: number = this.view.getInt16(this.viewOffset, littleEdian)
        this.viewOffset += 2
        
        return value
    }

    writeUint16(value: number, littleEdian?: boolean) {
        if (!littleEdian) {
            littleEdian = true
        }

        value = Math.max(value, 0)
        value = Math.min(value, 65535)

        this.view.setUint16(this.viewOffset, value, littleEdian)
        this.viewOffset += 2
    }

    readUint16(littleEdian?: boolean): number {
        if (!littleEdian) {
            littleEdian = true
        }

        let value: number = this.view.getUint16(this.viewOffset, littleEdian)
        this.viewOffset += 2
        
        return value
    }

    writeInt8(value: number) {
        value = Math.max(value, -128)
        value = Math.min(value, 127)

        this.view.setInt8(this.viewOffset, value)
        this.viewOffset += 1
    }

    readInt8(): number {
        let value: number = this.view.getInt8(this.viewOffset)
        this.viewOffset += 1
        
        return value
    }

    writeUint8(value: number) {
        value = Math.max(value, 0)
        value = Math.min(value, 255)

        this.view.setUint8(this.viewOffset, value)
        this.viewOffset += 1
    }

    readUint8(): number {
        let value: number = this.view.getUint8(this.viewOffset)
        this.viewOffset += 1
        
        return value
    }
}