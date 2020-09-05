"use strict";

let userMails = []
var userHtml = []

// pop-up
const showForm = () => {
    document.getElementById('mailForm').style.display = 'block'
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
            <input type="checkbox">
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


// local storage
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
// const a = (data) => {
//     fetch(data)
//         .then((res) => {
//             if (!res.ok) {
//                 throw Error("ERROR");
//             }
//             // var data = res.json()
//             // console.log(data)
//             return res.json()
//         }).then((data) => {
//             console.log(data)
//             addLocalStorage(data)
//         })
// }

// delete 
// to trash
let mItem = Array.prototype.slice.call(document.querySelectorAll('.main-item'))
mItem.map(x => x.addEventListener('click', function (event) {
    if (event.target.type === 'checkbox' && !event.target.checked) {
        event.target.setAttribute("checked", 'checked');
        // console.log(event.target)
        // console.log(event.target.checked)
    }else{
        event.target.removeAttribute("checked", 'checked')
        // console.log(event.target)
        // console.log(event.target.checked)
    }
}))