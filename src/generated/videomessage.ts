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
     * @generated from protobuf field: int32 cameraNumber = 1;
     */
    cameraNumber: number;
    /**
     * @generated from protobuf field: bool iframe = 2;
     */
    iframe: boolean;
    /**
     * @generated from protobuf field: bytes nalUnit = 3;
     */
    nalUnit: Uint8Array;
}
// @generated message type with reflection information, may provide speed optimized methods
class VideoMessage$Type extends MessageType<VideoMessage> {
    constructor() {
        super("VideoMessage", [
            { no: 1, name: "cameraNumber", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "iframe", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "nalUnit", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<VideoMessage>): VideoMessage {
        const message = { cameraNumber: 0, iframe: false, nalUnit: new Uint8Array(0) };
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
                case /* int32 cameraNumber */ 1:
                    message.cameraNumber = reader.int32();
                    break;
                case /* bool iframe */ 2:
                    message.iframe = reader.bool();
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
    internalBinaryWrite(message: VideoMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 cameraNumber = 1; */
        if (message.cameraNumber !== 0)
            writer.tag(1, WireType.Varint).int32(message.cameraNumber);
        /* bool iframe = 2; */
        if (message.iframe !== false)
            writer.tag(2, WireType.Varint).bool(message.iframe);
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
 * @generated MessageType for protobuf message VideoMessage
 */
export const VideoMessage = new VideoMessage$Type();
