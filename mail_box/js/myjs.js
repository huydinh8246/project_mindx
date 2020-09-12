"use strict";

var parser, xmlDoc;
  parser = new DOMParser();
function domParse(str){
    if(str.length > 0){
        return parser.parseFromString(str,"text/xml");
    }else{
        console.log(error);
    }
}

function domArray(selector) {
    if (document.querySelectorAll(selector).length > 0){
        return Array.prototype.slice.call(document.querySelectorAll(selector))
    } else{
        console.log(error);
    }
}


let userMails = []
var userHtml = []

// pop-up
const showForm = () => {
    document.getElementById('mailForm').style.display = 'block'
}

const showTrForm = () => {
    document.getElementById('mvTrash').style.display = 'block'
}

document.getElementById("btnSend").onclick = () => {
    mailData()
    document.getElementById('mailForm').style.display = 'none'
}

document.getElementById("closeForm").onclick = () => {
    document.getElementById('mailForm').style.display = 'none'
}

function hidePopup() {
    document.getElementById('mailForm').style.display = 'none'
}

function hidetrPopup() {
    document.getElementById('mvTrash').style.display = 'none'
}

//create mail
//local storage
function createMail(name, message, label = '') {
    if (name != '' && message != '') {
        const userMail = {
            id: Date.now(),
            v1: 'inbox',
            name: name,
            message: message,
            label: label,
            labelColor: labelColor(label),
            avatar: "images/avr_1.png",
            important: '',
        }
        userMail.html = itemList(userMail)
        userMails.push(userMail)
        // console.log(userMails)
        addLocalStorage(userMails)
    };

}

const itemList = (data) => {
    return `
    <div class='main-item'>
    <div class="w10"><img src="${data.avatar}" alt="" style="width: 48px; border-radius: 50%;"></div>
    <div class="flex w75">
        <div>
            <div style="height: 25px;">
                <h4 class="mt0">${data.name}</h4>
            </div>
            <div>
                <form class="ml10 fl">
                    <button style="background-color: ${data.labelColor}; border: none; color: white;" type="button"
                        onclick="">${data.label}</button>
                </form>
            </div>
        </div>
        <div>
            <p class="mt0" style="text-align: left;">
                ${subString(data.message.split(' '),0,10)}</p>
        </div>
    </div>
    <div class="w10" style="padding: 15px 0px;">2 hours</div>
    <div class="w5">
        <label class="container1">
            <input type="checkbox" name='dltCheck'>
        </label>
    </div>
</div>`
}

const renderItem = (res) => {
    let html = res.map(data => {
        let pTitle = document.title
        if (pTitle.toLowerCase() == data.v1.toLowerCase()) {
            let dataUser = itemList(data)
            if (!data.html || data.html == '') {
                data.html = dataUser;
                userMails.map(res => {
                    if (res.name === data.name) {
                        res.html = dataUser
                    }
                })
            }
            // userHtml.push(dataUsser)
            return dataUser
        }
    }).join('')

    document
        .querySelector('#main')
        .insertAdjacentHTML('afterbegin', html)

}

const subString = (array, first, last) => {
    return array.slice(first, last).join(' ')
}

function labelColor(label, data) {
    if (label != '') {
        return 'blue'
        // return data.labelColor
    }
}

const mailData = () => {
    let txtTo = document.querySelector('input[name="txtTo"]')
    let label = document.getElementById('lstLabel')
    let txtTitle = document.querySelector('input[name="txtTitle"]')
    let txtMessage = document.querySelector('input[name="txtMessage"]')
    let mail = createMail(txtTo.value, `${txtTitle.value}. ${txtMessage.value}`, label.options[label
        .selectedIndex].value);
    txtTo.value = ''
    label.value = ''
    txtTitle.value = ''
    txtMessage.value = ''
    return [mail]
}

// add data to local storage
function addLocalStorage(data) {
    localStorage.setItem('mail', JSON.stringify(data))
}

// get data from local storage
function getFromLocalStorage() {
    const reference = localStorage.getItem('mail');
    if (reference) {
        userMails = JSON.parse(reference);
        renderItem(userMails);
        addLocalStorage(userMails)
    }
}
getFromLocalStorage()

//fetch data and save to local
const a = (data) => {
    fetch(data)
        .then((res) => {
            if (!res.ok) {
                throw Error("ERROR");
            }
            // var data = res.json()
            // console.log(data)
            return res.json()
        }).then((data) => {
            console.log(data)
            addLocalStorage(data)
        })
}


let mItem = domArray('.main-item')
mItem.map(x => x.addEventListener('click', function (event) {
    shOption(event.target.checked)
    if (event.target.type === 'checkbox' && event.target.checked) {
        event.target.setAttribute("checked", 'checked');

        console.log(event.target.checked)
    } else {
        event.target.removeAttribute("checked", 'checked')
    }
}))

// mv to trash
const mvTrash = () => {
    mItem.map(x => {
        let chkBox = x.querySelector('input[type="checkbox"]')
        let name = x.querySelector('h4')
        if (chkBox.checked) {
            userMails.map(res => {
                if (res.name == name.innerHTML) {
                    res.v1 = 'trash'
                }
            })
            addLocalStorage(userMails)
        }
    })
    window.location.reload()
    document.getElementById('mvTrash').style.display = 'none'
}

// all check
let chkAll = document.getElementById("myCheck")
chkAll.onclick = () => {
    shOption(chkAll.checked)
    if (chkAll.checked) {
        var checkboxes = document.getElementsByName('dltCheck');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
    } else {
        var checkboxes = document.getElementsByName('dltCheck');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    }
}

function shOption(res) {
    let x = document.getElementById("Trash");
    let y = document.getElementById("Spam")
    if (res) {
        x.style.display = "block";
        y.style.display = "block";
    } else {
        x.style.display = "none";
        y.style.display = "none";
    }
}

// search bar
const searchKey = () => {
    let title, search, filter, items
    search = document.getElementById('search')
    filter = search.value.toLowerCase();
    items = domArray('.main-item')
    for (let i = 0; i < items.length; i++) {
        title = items[i].querySelector('h4').innerHTML
        if(title.toLowerCase().indexOf(filter) > -1){
            items[i].style.display=''
        }else{
            items[i].style.display='none'
        }    
    }
}
