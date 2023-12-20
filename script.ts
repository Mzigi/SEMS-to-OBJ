let fileInput: HTMLInputElement = <HTMLInputElement>document.getElementById("fileInput")
let convertToObjButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("convertToObj")
let tcoInput: HTMLInputElement = <HTMLInputElement>document.getElementById("textureCountOverride")

function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

convertToObjButton.addEventListener("click", function() {
    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            async function loadSEMS() {
                let tco = null
                if (tcoInput.value != "") {
                    tco = Number(tcoInput.value)
                }
                let buffer: ArrayBuffer = await fileInput.files[i].arrayBuffer()
                let convertedMesh = JSONtoOBJ(SEMStoJSON(buffer, tco), fileInput.files[i].name)
                console.log(convertedMesh.obj)
                console.log(convertedMesh.mtl)
                download(fileInput.files[i].name+".obj", convertedMesh.obj)
                download(fileInput.files[i].name+".mtl", convertedMesh.mtl)
            }

            loadSEMS()
        }
    }
})