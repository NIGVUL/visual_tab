// Выдает строку рандомного цвета
function randColor() {
    let = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256));
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}  


// Прив наведение курсором на блок он появляется
function mouseOver(id) {
    document.querySelector(`#allButton_${id}`).style.visibility = 'visible'
}
// При убирания курослра с элемента крусор убирается
function mouseOut(id) {
    document.querySelector(`#allButton_${id}`).style.visibility = 'hidden'
}

// Задаем цвет блока при нажатии на кнопку настроек
function giveColor(key) {
    let array = getArray()
    answerForColor = prompt('Введите цвет в хэш')

    if (answerForColor === null) {
        answerForColor = getValueARRAY(key, 'color')
    }
    else {

        saveKeyValueARRAY(key, 'color', answerForColor)
        drawArray()
    }
}

// При передачи ссылки, делаем из нее тех и заносим в 'ARRAY' localStorage под ключом text
function doFromeUrlText(link) {
     // Редактируем названия в блоках
     try {
         let = res = String(new URL(link).hostname)
       } catch (err) {
         res = link
       }
     // Удаляем из ссылки такие вещи как:
     let deleteThis = ['.com', '.ru', 'www.', '.org','.nz']
     for (let el of deleteThis) {
         res = res.replace(el, '')
     }
     res = res.toUpperCase().replace( /com.(.+)ru.+/,'$1' )
     return res
}

function setDefaultSettings(link) {
    let setDefaultSettings = { 'color': randColor(),
                               'text': doFromeUrlText(link)
                            }
    return setDefaultSettings
}

function addSpace(value) {
    value = value.split(' ')
    value = value.join(' ')
    return value     
}



//____________Интерфейсо важные функции____________

// Для запись по элементу содержиое (элемент, содержимое -> запись) (передается id или class ) #id #class 
function printElem(elem, value) {
    document.querySelector(elem).innerHTML += value
}


// Для основы в localStorage   ARRAY : {}    FOLDER : []
function createMain() {
    let folder = localStorage.getItem('FOLDER')
    if (folder=== null) {
        localStorage.setItem('FOLDER', JSON.stringify({}))
    }
    
    let array = localStorage.getItem('ARRAY')
    if (array === null) {
        localStorage.setItem('ARRAY', JSON.stringify({}))
    }

    let history = localStorage.getItem('HISTORY')
    if (history === null) {
        localStorage.setItem('HISTORY', JSON.stringify({}))
    }
}


// Для сохранения массива в LS
function saveInLS(keyInLS, oldElement) {
    localStorage.setItem(keyInLS, JSON.stringify(oldElement))
}


// Для получения массива из LS 
function getFromLS(keyInLS) {
    return JSON.parse(localStorage.getItem(keyInLS))
}


// Для секции для папки [{}, {}, {}, ...] 
function createFolder(answer=null) {
    let folder = getFromLS('FOLDER')
    if (answer === null) {
        answer = prompt('Введите название папки')
        answer = addSpace(answer)
    }


    if (!(answer in getFromLS('HISTORY'))) {
        if (answer !== null) {
            folder[answer] = {}
            saveInLS('FOLDER', folder)
            addInHistory(answer, 'FOLDER')
            drawElements()
            
        }
    }
}

function addInHistory(link, keyInLs) {
    let history = getFromLS('HISTORY')
    history[link] = keyInLs
    saveInLS('HISTORY',  history)
}

function delFromeHistory(link) {
    let history = getFromLS('HISTORY')
    delete history[link]
    saveInLS('HISTORY', history)
}

// Добавления ссылок с дефолтными настройками в ARRAY и FOLDER[nameFolder] 
function addInArrOrFold(keyInLS, nameFolder=null, linkAnswer=null) {
    if (linkAnswer === null) {
        linkAnswer = prompt('Введите ссылку на сайт')

    }
    

    // Если при выборе ссылки мы нажали отмена, то ничего не будет меняться
    
    if (linkAnswer !== null) {

        switch(keyInLS) {
            case 'ARRAY':
                linkAnswer = addSpace(linkAnswer)
                let array = getFromLS('ARRAY')
                if (!(linkAnswer in array)) {

                    array[linkAnswer] = {} // {'black':'color', 'text':'test'}
                    saveInLS('ARRAY', array)

                    // Устанавливаем дефолтные настройки для ссылок, цвет, текст
                    array = getFromLS('ARRAY')
                    array[linkAnswer] = setDefaultSettings(linkAnswer)
                    saveInLS('ARRAY', array)
                    addInHistory(linkAnswer, 'ARRAY')
                    drawElements()
                }
            break;

            case 'FOLDER':

                let folder = getFromLS('FOLDER')
                
                // Если ссылки не в папке то ничего не добавляем
                if (!(linkAnswer  in folder[nameFolder])) {
                    // Если нет папки добавляется
                    if (folder[nameFolder] == undefined) {
                        createFolder(nameFolder)
                        folder = getFromLS('FOLDER')
                    }

                    folder[nameFolder][linkAnswer] = {} // {'black':'color', 'text':'test'}
                    saveInLS('FOLDER', folder)

                    // Устанавливаем дефолтные настройки для ссылок, цвет, текст
                    folder = getFromLS('FOLDER')
                    folder[nameFolder][linkAnswer] = setDefaultSettings(linkAnswer)
                    saveInLS('FOLDER', folder)
                }   
            break;
        }   
    }
}


// Для добавления свойств к ссылкам {'color':'black', 'text':'test'}
function addValue(keyInLS, link, key, value, nameFolder='если для папки') {

    switch(keyInLS) {
        case 'ARRAY':
            let array = getFromLS('ARRAY')

            // Если ссылки нет в LS, то она добавляется
            if (array[link] === undefined) {
                array[link] = {}
                saveInLS('ARRAY', array)
                array = getFromLS('ARRAY')
            }
            array[link][key] = value
            saveInLS('ARRAY', array)
            break;

        case 'FOLDER':
            let folder = getFromLS('FOLDER')

            // Если нет папки, она добавляется
            if (folder[nameFolder] === undefined) {
                createFolder(nameFolder)
                folder = getFromLS('FOLDER')
            }

            // Если нет ссылки в папке, она добавляется
            if (folder[nameFolder][link] === undefined) {
                addInArrOrFold('FOLDER', nameFolder, link)
                folder = getFromLS('FOLDER')
            }
            folder[nameFolder][link][key] = value
            saveInLS('FOLDER', folder)
            break;
    }
}

// Для получения занчения указываес 'FOLDER' или 'ARRAY' потом ссылку, ключ и название папки, если ссылка в папке
function getValue(keyInLS, link, key, nameFolder=null) {
    switch(keyInLS) {
        case 'ARRAY':
            let array = getFromLS('ARRAY')
            return array[link][key]
        case 'FOLDER':
            let folder = getFromLS('FOLDER')
            return folder[nameFolder][link][key]
    }
}

// // Удалние из LS ТОЛЬКО ССЫЛОК ИЗ ARRAY
// // if (!e) var e = window.event;
//     //         e.cancelBubble = true;
//     // if (e.stopPropagation) e.stopPropagation();
//     function delFromeArrayLS(link) {
//         let array = getFromLS('ARRAY')
//         delete array[link]
//         saveInLS('ARRAY', array)
//         drawElements()
//         delFromeHistory(link)
//     }
//     // Удаление из LS ТОЛЬКО ПАПОК ИЗ FOLDER
//     function delFolderLS(nameFolder) {
//         let folder = getFromLS('FOLDER')
//         delete folder[nameFolder]
//         saveInLS('FOLDER', folder)
//         drawElements()
//         delFromeHistory(nameFolder)
//     }


// Удаление из LS ТОЛЬКО ССЫЛОК ИЗ ПАПОК ИЗ FOLDER
function delFromeFolderLS(nameFolder, link) {
    let folder = getFromLS('FOLDER')
    delete folder[nameFolder][link]

    saveInLS('FOLDER', folder)
    closeBlackFolder(nameFolder)
    openFolder(nameFolder)
    drawElements()
}

function delFromLS(link) {
    let history = getFromLS('HISTORY')
    let key = history[link] // Получаю либо ARRAY или FOLDER

    // Удаляем из оснвных
    let elements = getFromLS(key) 
    delete elements[link]
    saveInLS(history[link], elements)

    // Удаляем из истории
    delete history[link]
    saveInLS('HISTORY', history)
    drawElements()
}



// Переход по ссылке
function goLink(link) {
    document.location.replace(link)
    
}



function drawElements() {
    let array = getFromLS('ARRAY')
    let folder = getFromLS('FOLDER')
    let history = getFromLS('HISTORY')

    // Нарисуем сначала блоки ссылок в ARRAY

    count = 0
    document.querySelector('.grid').innerHTML = ''

    for (key in history) {
        let text = ''
        let colorForDiv = ''
        let action = ''

        if (history[key] === 'ARRAY') {
            text = getValue('ARRAY', key, 'text')
            colorForDiv = `background-color: ${getValue('ARRAY', key, 'color')}`
        }

        else if (history[key] === 'FOLDER') {
            text = key
            colorForDiv = `background-color: transparent`
        }
        
        // Создание кнопки удаления
        let settingsDelButton =`id='img_${count}' class='del' src='del.png' onclick=delFromLS('${key}') 
                            width='25px' height='25px'  onmouseover=mouseOver('${count}') 
                            onmouseout=mouseOut('${count}')`
        let delButton = `<img ${settingsDelButton}>`
        //Cоздание кнопки настроек
        let settingsSetButton = `id='set_${count}' class='set' src='setting.png' onclick=tabSettings('${key}')
                            width='25px' height='25px'  onmouseover=mouseOver('${count}') 
                            onmouseout=mouseOut('${count}')`
        let setButton = `<img ${settingsSetButton}>`
        
        // Создание текста в див
        let textInDiv = `<p class='link'>${text}<p>`
        // Создание дива с контенотом


        let settingDiv = ''

        if (history[key] === 'ARRAY') {
            settingDiv = `id='div_${count}' class="block" onclick=goLink('${key}') style='${colorForDiv}' 
                        onmouseover=mouseOver('${count}') onmouseout=mouseOut('${count}')
                        draggable='${true}' title='${key}'`
        }

        else if (history[key] === 'FOLDER') {
            settingDiv = `id='div_${count}' class="block" onclick=openFolder('${key}') style='${colorForDiv}' 
            onmouseover=mouseOver('${count}') onmouseout=mouseOut('${count}')
            draggable='${true}' title='${key}'`
        }
        
        let allButton =  `<div class='allButton' id='allButton_${count}' onmouseover=mouseOver('${count}') 
        onmouseout=mouseOut('${count}') > ${setButton} ${delButton}</div>`
        let divAndContent =  allButton + `<div ${settingDiv} >${textInDiv}</div>` 

        document.querySelector('.grid').innerHTML += `<div class='allDiv' id='all_${count}'>${divAndContent}</div>`
        count++
    }
}


// При передаче ссылки в эту функция возращается, где содержится это функция в ARRAY или FOLDER
function arrayOrFolder(link) {
    let history = getFromLS('HISTORY')
    return history[link]
    

}


function drawAfterDragandDrop() {
    arrayWrong = document.querySelectorAll('.block')
    let array = {}
    let oldArray = getFromLS('HISTORY')
    for (el of arrayWrong) {
        let key = el.title
        array[key] = oldArray[key]
    }
    saveInLS('HISTORY', array)
    drawElements()
}

// Для перетаскивания объектов 
function dragAndDrop(event) {
    let element = event.target.id
    let elementTwo = element.replace('div_', '') 
    const card = document.querySelector(`#${element}`)
    const cells = document.querySelectorAll('.block')
    

    function  dragStart () {
        document.querySelector(`#allButton_${elementTwo}`).style.visibility = 'hidden'
        setTimeout(() => { card.classList.add('hide')}, 0)
    }

    function dragEnd() {
        this.classList.remove('hide')
    };

    function dragOver (evt) {
        document.querySelector(`.allButton`).style.display = 'hidden'
        evt.preventDefault()
        count++
        if (count > 35) {
            try {
                let folder = getFromLS('FOLDER')
                let array = getFromLS('ARRAY')

                folder[this.title][card.title] = array[card.title]
                console.log(folder)
                saveInLS('FOLDER', folder)
                delFromLS(card.title)
            }
            catch {}
            
        }
    };

    function dragEnter () {
        let idALL = this.id.replace('div_', '')
        let all = document.querySelector(`#all_${idALL}`)
        
    };

    function dragLeave () {
        count = 0
        let idALL = this.id.replace('div_', '')
        let all = document.querySelector(`#all_${idALL}`)
    };

    function dragDrop () {
        let idALL = this.id.replace('div_', '')
        let delDiv = document.querySelector(`#div_${idALL}`)
        
        try {
        document.querySelector(`#all_${idALL}`).removeChild(this)

        document.querySelector(`#all_${idALL}`).appendChild(card)
        document.querySelector(`#all_${elementTwo}`).appendChild(delDiv)

        drawAfterDragandDrop()
        } catch {
            drawElements()
        }
        
    };
    
    dragStart()
    card.addEventListener('dragend', dragEnd)
    cells.forEach((cell) => {
        cell.addEventListener('dragover', dragOver)
        cell.addEventListener('dragenter', dragEnter)
        cell.addEventListener('dragleave', dragLeave)
        cell.addEventListener('drop', dragDrop)
    });
}




// ______________________Табло настроек для блоков (цвет и текст)______________________

// Создание табло
function tabSettings(key, nameFolder=null) {
    
    let div = document.createElement('div')
    div.id = 'tabSettings'
    div.style = "display: block"    
    div.style = "-webkit-box-shadow: -10px -2px 33px 26px rgba(255, 255, 255, 0.5);"
                + "-moz-box-shadow: -10px -2px 33px 26px rgba(255, 255, 255, 0.5);"
                + "box-shadow: -10px -2px 33px 26px rgba(255, 255, 255, 0.5);"
    document.body.append(div)



    // Создается темный экран
    printElem('body', `<div onclick=closeBlack('${key}','${nameFolder}') id='black'></div>`)
    let text = ''

    // Настройка табло
    if  (nameFolder === null) {
        if (arrayOrFolder(key) === 'ARRAY') {
            text = getValue('ARRAY', key, 'text')
        }
    
        else if (arrayOrFolder(key) === 'FOLDER') {
            text = key
        }
    }
    else {
        
        text = getValue('FOLDER', key, 'text', nameFolder)
    }
    

    printElem('#tabSettings', `<h2>Настройки блока ${text}</h2><br><br>`)

    // Если ссылка не на папкку, то добавить пункт поменять цвет
    if (arrayOrFolder(key) === 'ARRAY' || (!( nameFolder === null ) ) ) {
        printElem('#tabSettings', '<h2 class="h2Set" >Цвет</h2>')
        printElem('#tabSettings', '<input type="text" name="message" id="colorId" placeholder="Введите цвет"/>' )
        printElem('#tabSettings', '<br><br>')
    }   

    printElem('#tabSettings', '<h2 class="h2Set" >Изменить текст</h2>')
    printElem('#tabSettings', '<input type="text" name="message" id="textId" placeholder="Введите текст"/>' )


}





// Что происходит после закрытия табло (текст берется данные сохраняются)
function closeBlack(key, nameFolder=null) {
    let keyInLS = arrayOrFolder(key)
    let array = getFromLS(keyInLS)
    let color = ''

    if (!(nameFolder === 'null')) {
        let color = document.getElementById("colorId").value
        let text = addSpace( document.getElementById('textId').value )


        if (text === '' ) {} 
        else {
            addValue('FOLDER', key, 'text', text, nameFolder)
        }

        if (color === '' ) {} 
        else {  
            addValue('FOLDER', key, 'color', color, nameFolder)
        }
    closeBlackFolder(nameFolder)
    openFolder(nameFolder)
    document.querySelector('#tabSettings').remove()
    document.querySelector('#black').remove()
        
    }

    else {
        if (keyInLS === 'ARRAY') {
            color = document.getElementById("colorId").value
            if ( color === '') {} else { 
                addValue('ARRAY', key, 'color', color)
                
            }
        }
    
        let text = addSpace( document.getElementById('textId').value )
    
        if (keyInLS === 'ARRAY') {
            if (text === '' ) {} 
            else {
                addValue('ARRAY', key, 'text', text)
            }
        }
    
    
    
    
        else if (keyInLS === 'FOLDER') {
            if (text === '' ) {} 
            else {
                delFromLS(key)
                let content = array[key]
                array[text] = content
                delete array[key]
                saveInLS('FOLDER', array)
    
                let history = getFromLS('HISTORY')
                history[text] = array[key]
                delete key
    
                addInHistory(text,'FOLDER')
            }
        }

        drawElements()
        document.querySelector('#tabSettings').remove()
        document.querySelector('#black').remove()
    }

    
    
    
}







function openFolder(key) {
    printElem('body', `<div onclick=closeBlackFolder('${key}') id='blackFolder'></div>`)
    printElem('body', `<img id='addFoldButton' src='add.png' (this) width='55' height='55' onclick=addInFold('${key}')>`)
    document.querySelector('.grid').classList.add("hideGrid");
    drwaInfolder(key)
    
}

function drwaInfolder(key) {
    
    if ( Object.keys( getFromLS('FOLDER')[key]).length === 0 ) {
        printElem('body', `<div class='folder' id='idFolder' ></div>`)
        document.querySelector('#idFolder').style.visibility = 'hidden'
    }
    else {    
        printElem('body', `<div class='folder' id='idFolder' ></div>`)
        document.querySelector('#idFolder').style.visibility = 'visible'
    }

    document.querySelector('.folder').innerHTML = ''
    let folder = getFromLS('FOLDER')[key]
    count = 100


    for (link in folder) {

        let text = getValue('FOLDER', link, 'text', key)
        let colorForDiv = `background-color: ${getValue('FOLDER', link, 'color', key)}`

        // Создание кнопки удаления
        let settingsDelButton =`id='img_${count}' class='del' src='del.png' onclick=delFromeFolderLS('${key}','${link}') 
                            width='25px' height='25px'  onmouseover=mouseOver('${count}') 
                            onmouseout=mouseOut('${count}')`
        let delButton = `<img ${settingsDelButton}>`
        //Cоздание кнопки настроек
        let settingsSetButton = `id='set_${count}' class='set' src='setting.png' onclick=tabSettings('${link}','${key}')
                            width='25px' height='25px'  onmouseover=mouseOver('${count}') 
                            onmouseout=mouseOut('${count}')`
        let setButton = `<img ${settingsSetButton}>`
        
        // Создание текста в див
        let textInDiv = `<p class='link'>${text}<p>`
        // Создание дива с контенотом


        let settingDiv = ''

        
        settingDiv = `id='div_${count}' class="folderBlock" onclick=goLink('${link}') style='${colorForDiv}' 
                    onmouseover=mouseOver('${count}') onmouseout=mouseOut('${count}')
                    draggable='${true}' title='${key}'`
        

        
        
        let allButton =  `<div class='allButton' id='allButton_${count}' onmouseover=mouseOver('${count}') 
        onmouseout=mouseOut('${count}') > ${setButton} ${delButton}</div>`
        let divAndContent =  allButton + `<div ${settingDiv} >${textInDiv}</div>` 

        document.querySelector('.folder').innerHTML += `<div class='allDiv' id='all_${count}'>${divAndContent}</div>`
        count++
    }
    
}

function addInFold(key) {
    let answer = prompt('Введите сслыку')
    closeBlackFolder(key)
    addInArrOrFold('FOLDER', key, answer)
    openFolder(key)

}

function closeBlackFolder(key) {
    document.querySelector('#idFolder').remove()
    document.querySelector('#blackFolder').remove()
    document.querySelector('#addFoldButton').remove()
    document.querySelector('.grid').classList.remove("hideGrid");
}



createMain()
drawElements()

window.addEventListener('dragstart', dragAndDrop)



