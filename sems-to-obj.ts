interface Vector3 {
    x: number,
    y: number,
    z: number,
}

interface Vector2 {
    x: number,
    y: number,
}

function smallRound(value: number): number {
    return value
    //return Math.round(value * 1000) / 1000
}

function isSEMS(arrayBuffer: ArrayBuffer) {
    let view = new Uint8Array(arrayBuffer)
    if (view[0] == 83 && view[1] == 69 && view[2] == 77 && view[3] == 83) {
        return true
    } else {
        return false
    }
}

function SEMStoJSON(buffer: ArrayBuffer, textureCountOverride?: number) {
    let SMESjson = {
        "meshCount": 0,
        "meshes": [],
    }

    if (isSEMS(buffer)) {
        let view = new simpleView(buffer)
        view.viewOffset = 12

        SMESjson.meshCount = view.readUint8()
        
        view.viewOffset += 3
        
        //meshes
        for (let i = 0; i < SMESjson.meshCount; i++) {
            let mesh = {
                "vCount": 0,
                "triCount": 0,
                "textureCount": 0,
                "v": [],
                "vn": [],
                "vt": [],
                "faces": [],
                "textures": {},
                "boundingBox": [],
                "texture1Exists": false, //diffuse
                "texture2Exists": false, //normal
                "texture3Exists": false, //specular
                "texture4Exists": false, //height (unused?)
            }
            view.viewOffset += 12

            //bounding box
            let boundingBox1: Vector3 = {"x": smallRound(-view.readFloat32()), "y": smallRound(view.readFloat32()), "z": smallRound(view.readFloat32())}
            mesh.boundingBox.push(boundingBox1)

            let boundingBox2: Vector3 = {"x": smallRound(-view.readFloat32()), "y": smallRound(view.readFloat32()), "z": smallRound(view.readFloat32())}
            mesh.boundingBox.push(boundingBox2)

            //texture data
            view.viewOffset += 12
            /*for (let j = 0; j < 4; j++) {
                mesh["texture" + (j + 1) + "Exists"] = view.readUint8() == 128
            }*/
            //textures that exist
            let existingTextures = view.readInt32()

            if (existingTextures == -8421505) {
                mesh.textureCount = 1
                mesh.texture1Exists = true
            } else if (existingTextures == -8355712) {
                mesh.textureCount = 3
                mesh.texture1Exists = true
                mesh.texture2Exists = true
                mesh.texture3Exists = true
            } else {
                mesh.textureCount = 3
            }

            if (textureCountOverride) {
                mesh.texture1Exists = false
                mesh.texture2Exists = false
                mesh.texture3Exists = false
                mesh.texture4Exists = false

                if (textureCountOverride >= 1) {
                    mesh.textureCount = 1
                    mesh.texture1Exists = true
                } else if (textureCountOverride >= 2) {
                    mesh.textureCount = 2
                    mesh.texture2Exists = true
                } else if (textureCountOverride >= 3) {
                    mesh.textureCount = 3
                    mesh.texture3Exists = true
                } else if (textureCountOverride >= 4) {
                    mesh.textureCount = 4
                    mesh.texture4Exists = true
                }
            }

            view.viewOffset  += 16
            for (let j = 0; j < 4; j++) { //check individual textures
                if (mesh["texture" + (j + 1) + "Exists"]) {

                    //skip padding?
                    if (j > 0) {
                        view.viewOffset += 3
                    }

                    view.viewOffset += 1

                    //get texture string
                    let texturePath = view.readUtf8String()
                    mesh.textures[j] = texturePath

                    view.viewOffset += 3
                }
            }
            view.viewOffset += 58 + 4 - mesh.textureCount
            console.log(view.viewOffset)

            //geometry
            mesh.vCount = view.readUint32()
            console.log("Vertices Count: "+mesh.vCount)
            console.log(view.viewOffset)
            for (let j = 0; j < mesh.vCount; j++) { // 36 bytes, v, vn, FFFF, vt
                mesh.v.push({"x": smallRound(-view.readFloat32()), "y": smallRound(view.readFloat32()), "z": smallRound(view.readFloat32())})
                mesh.vn.push({"x": smallRound(-view.readFloat32()), "y": smallRound(view.readFloat32()), "z": smallRound(view.readFloat32())})
                view.viewOffset += 4
                mesh.vt.push({"x": smallRound(view.readFloat32()), "y": smallRound(-view.readFloat32())})
            }

            //indices
            mesh.triCount = view.readInt32() / 3
            console.log("Tri Count: "+mesh.triCount)
            console.log(view.viewOffset)
            for (let j = 0; j < mesh.triCount; j++) {
                let triangle = [view.readUint16(), view.readUint16(), view.readUint16()]
                triangle = [triangle[2] + 1,triangle[1] + 1,triangle[0] + 1] //flip triangle and add 1 so its like obj
                mesh.faces.push(triangle)
            }

            //finally push the finished mesh
            SMESjson.meshes.push(mesh)
        }
    }

    console.log(SMESjson)
    return SMESjson
}

function JSONtoOBJ(SMESjson: any): any {
    let objText = "mtllib mesh.mtl"
    let mtlText = ""

    let fCount = 0

    for (let i = 0; i < SMESjson.meshes.length; i++) {
        let mesh = SMESjson.meshes[i]

        //mtl
        mtlText += "\nnewmtl mesh"+i
        mtlText += "\nillum 4\nKd 0.00 0.00 0.00\nKa 0.00 0.00 0.00\nTf 1.00 1.00 1.00\nNi 1.00\nKs 0.00 0.00 0.00"
        if (mesh.texture1Exists) {
            let texture1Path = mesh.textures[0].split("/")[mesh.textures[0].split("/").length - 1]
            mtlText += "\nmap_Kd "+texture1Path
        }
        if (mesh.texture2Exists) {
            let texture2Path = mesh.textures[1].split("/")[mesh.textures[1].split("/").length - 1]
            mtlText += "\nbump  -bm 1 "+texture2Path
        }
        if (mesh.texture3Exists) {
            let texture3Path = mesh.textures[2].split("/")[mesh.textures[2].split("/").length - 1]
            mtlText += "\nmap_Ks "+texture3Path
        }

        objText +=  "\nusemtl mesh"+i

        //v, vn, vt
        for (let j = 0; j < mesh.vCount; j++) {
            let vPos = mesh.v[j]
            let vNor = mesh.vn[j]
            let vTex = mesh.vt[j]

            objText += "\nv "+vPos.x+" "+vPos.y+" "+vPos.z
            objText += "\nvn "+vNor.x+" "+vNor.y+" "+vNor.z
            objText += "\nvt "+vTex.x+" "+vTex.y
        }

        //faces
        for (let j = 0; j < mesh.triCount; j++) {
            let i0 = mesh.faces[j][0] + fCount
            let i1 = mesh.faces[j][1] + fCount
            let i2 = mesh.faces[j][2] + fCount

            objText += `\nf ${i0}/${i0}/${i0} ${i1}/${i1}/${i1} ${i2}/${i2}/${i2}`
        }

        fCount += mesh.faces.length
    }

    return {"obj": objText, "mtl": mtlText}
}