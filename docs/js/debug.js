export default class Debug {

    static logHTML;
    static maxLines = 80;  

    static refresh() {
        Debug.logHTML = document.getElementById("debug-log");
        if (Debug.logHTML) {
            console.log("debugger > " + Debug.logHTML);
        } else {
            console.warn("debug-log element not found");
        }
    }

    static log(log) {

        const logString = log instanceof String ? log : String(log); 

        const timestamp = new Date().toLocaleTimeString(); 

        const formattedLog = logString.split('\n').map((line, index) => {
            const indent = index === 0 ? '' : '&nbsp;'.repeat(15); 
            return index === 0 ? `[${timestamp}] ${line}` : `${indent}${line}`;
        }).join('<br/>');

        let currentLines = Debug.logHTML.querySelectorAll('br').length;

        if (currentLines >= Debug.maxLines*2 ) { 
            let lines = Debug.logHTML.innerHTML.split('<br>');
            lines.splice(0, 10);
            Debug.logHTML.innerHTML = lines.join('<br/>');
        }

        if (currentLines >= Debug.maxLines ) { 
            let lines = Debug.logHTML.innerHTML.split('<br>');
            lines.splice(0, 1);
            Debug.logHTML.innerHTML = lines.join('<br/>');
        }


        Debug.logHTML.innerHTML += formattedLog + "<br/>";

        Debug.logHTML.scrollTop = Debug.logHTML.scrollHeight;

        console.log("debug -> " + log);
    }
}