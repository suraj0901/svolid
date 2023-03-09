export class _runtime$ {
    static context = new Array()
    static bindText = (element, callback) => {
        this.context.push(() => element.textContent = callback())
        callback()
        this.context.pop()
    }
    static bindAttr = (element, attribute, callback) => {
        this.context.push(() => element.setAttribute(attribute, callback()))
        callback()
        this.context.pop()
    }
    static render = (app, target) => {
        if(!target) return
        const template = document.createElement('template')
        template.innerHTML= app()
        const temp = template.content.cloneNode(true)
        console.log(temp.childNodes);
        target.append(...temp.childNodes)
    }
}

export const useState = (intialValue) => {
    const subscribers = new Set()
    const getter = () => {
        const subscriber = _runtime$.context.at(-1)
        if(subscriber) subscribers.add(subscriber)
        return intialValue
    }
    const setter = (newValue) => {
        if (typeof newValue === "function") intialValue = newValue(structuredClone(intialValue))
        else intialValue = newValue
        subscribers.forEach(subscriber => subscriber())
    }
    return [getter, setter]
}