"use strict"


let buuton = document.getElementsByTagName("button")[0]
buuton.onclick = function () {
    let fileList = document.getElementById("file").files
    fileList = [...fileList]
    let file = fileList[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = async function () {
        let infoSheet = document.getElementById("info")
        infoSheet.style.display = "flex"
        let arr = reader.result.split("\r\n")
        arr = arr.map((el) => el.trim())
        let functions = await findFunctions(arr)
        let objects = await findObjeccts(arr)
        let arrays = findArrays(arr)
        let variables = arr.filter((el) => el.startsWith("let"))
        let constants = arr.filter((el) => el.startsWith("const"))
        let place = document.getElementById("infoSheet")
        place.innerHTML = ""
        renderInfoSheetDiv(variables, "infoItem", "Variables", "var")
        renderInfoSheetDiv(constants, "infoItem", "Constants", "const")
        renderInfoSheetDiv(functions, "infoItem", "Functions", "func")
        renderInfoSheetDiv(objects, "infoItem", `  Objects\n `, "obj")
        renderInfoSheetDiv(arrays, "infoItem", `  Arrays\n `, "arr")

    }
};

function findFunctions(array) {
    return new Promise((resolve) => {
        let rightArray = []
        for (let i = 0; i < array.length; i++) {
            let startIndexNum = null
            let endIndexNum = null
            if (array[i].startsWith("function")) {
                startIndexNum = i
                for (let j = i; endIndexNum == null; j++) {
                    if (array[j].endsWith("}") || array[j].endsWith("};")) {
                        endIndexNum = j
                        // console.log(endIndexNum);
                        let fun = array.splice(i, j - (i - 1)).join("  ")
                        rightArray.push(fun)

                    }
                }
            }
        } resolve(rightArray)
    })

};

function findObjeccts(array) {
    return new Promise((resolve) => {
        let rightArray = []
        for (let i = 0; i < array.length; i++) {
            let startIndex = null
            let endIndex = null
            if (array[i].startsWith("let") || array[i].startsWith("const")) {
                if (array[i].includes("{")) {
                    startIndex = i
                    for (let j = i + 1; endIndex == null; j++) {
                        if (array[j].includes("}")) {
                            endIndex = j
                            let obj = array.splice(startIndex, endIndex - (startIndex - 1)).join(" ")
                            rightArray.push(obj)
                        }
                    }
                }
            }
        } resolve(rightArray)
    })

};

function findArrays(array) {
    let rightArray = []
    for (let i = 0; i < array.length; i++) {
        if (array[i].startsWith("let") && array[i].includes("]")) {
            rightArray.push(array[i])
            array.splice(i, 1)
        }
    } return rightArray
};


function renderInfoSheetDiv(arr, className, text, idName) {
    let place = document.getElementById("infoSheet")
    let div = document.createElement("div")
    div.classList.add(className)
    div.id = idName
    div.innerText = text + " " + arr.length
    div.onclick = function renderContainer() {
        let place = document.getElementById("container")
        place.innerHTML = ""
        for (let i = 0; i < arr.length; i++) {
            let div = document.createElement("div")
            div.innerText = arr[i]
            div.classList.add("containerItem")
            place.append(div)

        }
    }
    place.append(div)
};



