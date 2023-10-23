// @generated by protobuf-ts 2.9.1
// @generated from protobuf file "videomessage.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message VideoMessage
 */
export interface VideoMessage {
    /**
     * stream identifier
     *
     * @generated from protobuf field: VideoStreamKey videoStreamKey = 1;
     */
    videoStreamKey?: VideoStreamKey;
    /**
     * @generated from protobuf oneof: frame
     */
    frame: {
        oneofKind: "h264VideoMessage";
        /**
         * @generated from protobuf field: H264VideoMessage h264VideoMessage = 2;
         */
        h264VideoMessage: H264VideoMessage;
    } | {
        oneofKind: "mjpegImage";
        /**
         * @generated from protobuf field: MJPEGImage mjpegImage = 3;
         */
        mjpegImage: MJPEGImage;
    } | {
        oneofKind: undefined;
    };
}
/**
 * the nal unit message for h264
 *
 * @generated from protobuf message H264VideoMessage
 */
export interface H264VideoMessage {
    /**
     * @generated from protobuf field: bool iframe = 1;
     */
    iframe: boolean;
    /**
     * @generated from protobuf field: bool isParameterSet = 2;
     */
    isParameterSet: boolean;
    /**
     * @generated from protobuf field: bytes nalUnit = 3;
     */
    nalUnit: Uint8Array;
}
/**
 * the jpeg image bytes
 *
 * @generated from protobuf message MJPEGImage
 */
export interface MJPEGImage {
    /**
     * @generated from protobuf field: bytes image = 1;
     */
    image: Uint8Array;
}
/**
 * @generated from protobuf message VideoStreamKey
 */
export interface VideoStreamKey {
    /**
     * @generated from protobuf field: int32 cameraNumber = 1;
     */
    cameraNumber: number;
    /**
     * @generated from protobuf field: bool scaled = 2;
     */
    scaled: boolean;
}
// @generated message type with reflection information, may provide speed optimized methods
class VideoMessage$Type extends MessageType<VideoMessage> {
    constructor() {
        super("VideoMessage", [
            { no: 1, name: "videoStreamKey", kind: "message", T: () => VideoStreamKey },
            { no: 2, name: "h264VideoMessage", kind: "message", oneof: "frame", T: () => H264VideoMessage },
            { no: 3, name: "mjpegImage", kind: "message", oneof: "frame", T: () => MJPEGImage }
        ]);
    }
    create(value?: PartialMessage<VideoMessage>): VideoMessage {
        const message = { frame: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<VideoMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: VideoMessage): VideoMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* VideoStreamKey videoStreamKey */ 1:
                    message.videoStreamKey = VideoStreamKey.internalBinaryRead(reader, reader.uint32(), options, message.videoStreamKey);
                    break;
                case /* H264VideoMessage h264VideoMessage */ 2:
                    message.frame = {
                        oneofKind: "h264VideoMessage",
                        h264VideoMessage: H264VideoMessage.internalBinaryRead(reader, reader.uint32(), options, (message.frame as any).h264VideoMessage)
                    };
                    break;
                case /* MJPEGImage mjpegImage */ 3:
                    message.frame = {
                        oneofKind: "mjpegImage",
                        mjpegImage: MJPEGImage.internalBinaryRead(reader, reader.uint32(), options, (message.frame as any).mjpegImage)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: VideoMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* VideoStreamKey videoStreamKey = 1; */
        if (message.videoStreamKey)
            VideoStreamKey.internalBinaryWrite(message.videoStreamKey, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* H264VideoMessage h264VideoMessage = 2; */
        if (message.frame.oneofKind === "h264VideoMessage")
            H264VideoMessage.internalBinaryWrite(message.frame.h264VideoMessage, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* MJPEGImage mjpegImage = 3; */
        if (message.frame.oneofKind === "mjpegImage")
            MJPEGImage.internalBinaryWrite(message.frame.mjpegImage, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message VideoMessage
 */
export const VideoMessage = new VideoMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class H264VideoMessage$Type extends MessageType<H264VideoMessage> {
    constructor() {
        super("H264VideoMessage", [
            { no: 1, name: "iframe", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "isParameterSet", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "nalUnit", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<H264VideoMessage>): H264VideoMessage {
        const message = { iframe: false, isParameterSet: false, nalUnit: new Uint8Array(0) };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<H264VideoMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: H264VideoMessage): H264VideoMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool iframe */ 1:
                    message.iframe = reader.bool();
                    break;
                case /* bool isParameterSet */ 2:
                    message.isParameterSet = reader.bool();
                    break;
                case /* bytes nalUnit */ 3:
                    message.nalUnit = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: H264VideoMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool iframe = 1; */
        if (message.iframe !== false)
            writer.tag(1, WireType.Varint).bool(message.iframe);
        /* bool isParameterSet = 2; */
        if (message.isParameterSet !== false)
            writer.tag(2, WireType.Varint).bool(message.isParameterSet);
        /* bytes nalUnit = 3; */
        if (message.nalUnit.length)
            writer.tag(3, WireType.LengthDelimited).bytes(message.nalUnit);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message H264VideoMessage
 */
export const H264VideoMessage = new H264VideoMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MJPEGImage$Type extends MessageType<MJPEGImage> {
    constructor() {
        super("MJPEGImage", [
            { no: 1, name: "image", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<MJPEGImage>): MJPEGImage {
        const message = { image: new Uint8Array(0) };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<MJPEGImage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MJPEGImage): MJPEGImage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes image */ 1:
                    message.image = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: MJPEGImage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bytes image = 1; */
        if (message.image.length)
            writer.tag(1, WireType.LengthDelimited).bytes(message.image);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message MJPEGImage
 */
export const MJPEGImage = new MJPEGImage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class VideoStreamKey$Type extends MessageType<VideoStreamKey> {
    constructor() {
        super("VideoStreamKey", [
            { no: 1, name: "cameraNumber", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "scaled", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<VideoStreamKey>): VideoStreamKey {
        const message = { cameraNumber: 0, scaled: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<VideoStreamKey>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: VideoStreamKey): VideoStreamKey {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 cameraNumber */ 1:
                    message.cameraNumber = reader.int32();
                    break;
                case /* bool scaled */ 2:
                    message.scaled = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: VideoStreamKey, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 cameraNumber = 1; */
        if (message.cameraNumber !== 0)
            writer.tag(1, WireType.Varint).int32(message.cameraNumber);
        /* bool scaled = 2; */
        if (message.scaled !== false)
            writer.tag(2, WireType.Varint).bool(message.scaled);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message VideoStreamKey
 */
export const VideoStreamKey = new VideoStreamKey$Type();