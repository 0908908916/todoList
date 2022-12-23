let section = document.querySelector("section"); //  抓這個 section 放進元素用
let add = document.querySelector("form button"); // 先抓這個 button 來處理
add.addEventListener("click", (e) => {
  e.preventDefault(); // 東西不會先交出去 如果沒有這個 東西都會先交出去 所以甚麼都沒發生 會阻擋傳出去

  // 去獲得三個 input 的數 顯示在下面
  let form = e.target.parentElement; // target 获取触发特定事件的元素 parentElement 是當前節點的父元素。它永遠是一個DOM元素對象，或者說null。
  let todoText = form.children[0].value; // children 找他的第幾項 value 印出他的值 輸入第0項的文字就會出現在主控台
  let todoMonth = form.children[1].value; // children 找他的第幾項 value 印出他的值 輸入第1項的月份就會出現在主控台
  let todoDate = form.children[2].value; // children 找他的第幾項 value 印出他的值 輸入第2項的日期就會出現在主控台

  if (todoText === "") {
    alert("請不要在裡面留白"); // 預防問題 因為沒有這個 留白再輸入 下面回有空值
    return; // 記得要 return 不希望在執行下面的東西 沒有要回傳任何東西
  }

  // add()會在一個Set物體的尾端加上一個指定value的新元素。
  // 創造一個元素 (item) 出現在下面
  let todo = document.createElement("div");
  todo.classList.add("todo"); // 創建一個 todo 串列
  let text = document.createElement("p"); // 創建文字 p
  text.classList.add("todo-text"); // 創建 todo 文字
  text.innerText = todoText;
  let time = document.createElement("p"); // 以此類推 在創建 月份跟日期
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text); // 加到 todo 裡面 這樣就有一個基本的 todo  appendChild 添加小孩進去
  todo.appendChild(time);

  // 紅色垃圾桶 跟 綠色勾勾 要在這裡創建
  let completeButton = document.createElement("button"); // 創建一個 打勾勾的 button
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'; // 外面要包單引號 雙引號會有問題 這邊不是文字 是圖標 所以用 innerHTML 再到這個網址複製他的 <i class="fa-solid fa-check"></i> 要用一個 string 用 firefox(瀏覽器) 去找這個網址 https://fontawesome.com/icons/user-check?s=light&f=classic 方可使用
  // 做這個打勾的功能 點進去 出現橫線 代表完成 在點一次 代表還沒 會恢復原來的樣子
  completeButton.addEventListener("click", (e) => {
    //  e.target.parentElement 這樣就可以獲得 這個 todo <div class="todo" ...></div>
    let todoItem = e.target.parentElement;
    // 測試抓到是不是自己要的
    // console.log(e.target.parentElement); // 裡面會有兩個元素的 class 勾勾  <i class="fa-solid fa-check"></i> 跟 外層 的 complete 所以怕點擊有問題 在 css 要把 i 的 pointer-events: none;  設為 none 就點不到這個 i 了

    // toggle 的作用 點進去 done 沒有的話 就加進去 有的話 就刪除
    todoItem.classList.toggle("done"); // 已經完成 原本 class="todo" 變成  class="done" 然後用這個 done 到 css設定一下
  });

  let trashButton = document.createElement("button"); // 垃圾筒的
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

  // 按下垃圾桶 資料消失 先找到串列全部整個元素  class="todo"
  // 連結 css 動畫 @keyframes scaleDown 按下去 會縮回
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement; // 出現 class="todo"

    todoItem.addEventListener("animationend", () => {
      // 同時移除  localStorage 如果要一起移動 就全選 按住 shift  按下 tab 就會往前一起移動
      let text = todoItem.children[0].innerText; // 這是他的 首項 第一個 children 為 number 0 是  todoText
      let myListArray = JSON.parse(localStorage.getItem("list")); // 我要的東西是 localStorage.getItem("list")
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          // 我要的屬性是 todoText 這個 如果上面相等的話 把這個 array 移除掉
          myListArray.splice(index, 1); // 從 splice 元素 1 位置 切下去 移除
          localStorage.setItem("list", JSON.stringify(myListArray)); // 移除完更新 localStorage 變成JSON 字符串
        }
      });

      todoItem.remove(); // 在動畫結束之後 才做刪除的動作 就會移除全部元素 正常執行
    });

    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(completeButton); // 把這個圖標放進去 todo 裡面 才會顯示
  todo.appendChild(trashButton);

  todo.style.animation = "scaleUp 0.3s forwards"; // 連屆 style.scss 的 @keyframes scaleUp 做使用 讓這個 todo 有動畫

  // 創建一個物件 把上面的 物件 儲存 object  再放進 list array 裡面
  // 假設我們從網絡服務器收到了這段文本
  // 複製上面這些 文字 月 日  let todoText = form.children[0].value; 以此類推
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // 把資料放進一個 array 裡面
  let myList = localStorage.getItem("list"); // 創建一個 list
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo])); // 空值把它放到一個 array
  } else {
    let myListArray = JSON.parse(myList); // 使用 JavaScript 函數JSON.parse()將文本轉換為 JavaScript 對象：
    // myList 這個 是從上面 getItem 裡面來的 parse 處理過 才會變成我們要的 array
    myListArray.push(myTodo); // 把 myTodo 加進來
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  // 要記得下面這行
  console.log(JSON.parse(localStorage.getItem("list")));
  // (else 邏輯)  localStorage 本來就有 list array的話  把它 parse 把它換成 array, array之後加入 myTodo 的 object 最後在 setItem
  // 應用之前存過的東西 做處理
  form.children[0].value = ""; // 把輸入清空 打得字不會保留在上面 就不用刪掉重打
  section.appendChild(todo); // 把它放進 section 裡面 就完成了一個清單
});

// 讓網頁顯示資料 原本關網頁之後資料只會留存資料庫 現在給她顯示 以下程式碼用處
// add()會在一個Set物體的尾端加上一個指定value的新元素。
// 創建一個 loadDate 函數 在裡面

loadData(); // 要執行這個 javaSript 一定要注意 要先執行一次 用這個網站就會跑一次 loadData

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    // 不想要這個串列是空的 就添加 跟上面 todo 一樣原理
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      // 創建 todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText; // 記得這個 todo 是物件 連結上面的 myTodo
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      // ---------------
      // 紅色垃圾桶 跟 綠色勾勾 要在這裡創建
      let completeButton = document.createElement("button"); // 創建一個 打勾勾的 button
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

      // 做這個打勾的功能 點進去 出現橫線 代表完成 在點一次 代表還沒 會恢復原來的樣子
      completeButton.addEventListener("click", (e) => {
        //  e.target.parentElement 這樣就可以獲得 這個 todo <div class="todo" ...></div>
        let todoItem = e.target.parentElement;
        // 測試抓到是不是自己要的
        // console.log(e.target.parentElement); // 裡面會有兩個元素的 class 勾勾  <i class="fa-solid fa-check"></i> 跟 外層 的 complete 所以怕點擊有問題 在 css 要把 i 的 pointer-events: none;  設為 none 就點不到這個 i 了

        // toggle 的作用 點進去 done 沒有的話 就加進去 有的話 就刪除
        todoItem.classList.toggle("done"); // 已經完成 原本 class="todo" 變成  class="done" 然後用這個 done 到 css設定一下
      });

      let trashButton = document.createElement("button"); // 垃圾筒的
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

      // 按下垃圾桶 資料消失 先找到串列全部整個元素  class="todo"
      // 連結 css 動畫 @keyframes scaleDown 按下去 會縮回
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement; // 出現 class="todo"

        todoItem.addEventListener("animationend", () => {
          // 同時移除  localStorage
          let text = todoItem.children[0].innerText; // 這是他的 首項 第一個 children 為 number 0 是  todoText
          let myListArray = JSON.parse(localStorage.getItem("list")); // 我要的東西是 localStorage.getItem("list")
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              // // 我要的屬性是 todoText 這個 如果上面相等的話 把這個 array 移除掉
              myListArray.splice(index, 1); // 從 splice 元素 1 位置 切下去 移除
              localStorage.setItem("list", JSON.stringify(myListArray)); // // 移除完更新 localStorage 變成JSON 字符串
            }
          });

          todoItem.remove(); // 在動畫結束之後 才做刪除的動作 就會移除全部元素 正常執行 這個沒有在localStorage 裡面移除 所以要設定 以上
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      // 再把垃圾桶 跟打勾勾圖示 放到 todo 最終再放到 section 裡面
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

// 排列 mergeTime 函式 演算法
// 將串列作合併
// 導入上方 的 導入上方 的  todoMonth 和 todoDate
// str 要改成 number 不然會有大小排序問題
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  // 剩下的沒有比較的數 做處理
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

// 把上面函數放進另一個函數裡面
// 遞迴 跑到 元素 =  1 的時候 就會跳出去  會一直重複到 他的值為 1
// 對這個 arr 做排列
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle); // 在這邊不會包含這一點 middle 所以才能用  middle 作結束
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// 可以測試這段程式碼有沒有問題 把它顯示出來
// 沒有下面這段 執行會 bug
// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

// 務必記得 資料有錯誤 要先到 localStorage 去本地儲存資料 先清空資料 不然就會 bug

// sort 排序日期
let sortButton = document.querySelector("div.sort button"); // 找這個 div sort 裡面的 button
sortButton.addEventListener("click", () => {
  // sort data 排列資料 上面的 console 可以先註解掉
  // 1. 改變 data 資料
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list"))); // 先找到已排列過得資料
  localStorage.setItem("list", JSON.stringify(sortedArray)); // 把 list 的東西換成 sortedArray

  // remove data  全部刪除 再重新排列一個資料
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove(); // 刪除他的第0項 剩下就會一直減下去
  }
  //  load data
  loadData(); // 這邊在執行一次 上面得 loadData 函數
});
