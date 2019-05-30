export default class Node {
    /**
     * @type {string}
     */
    name;

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Render the node
     * @param {function(name: string): (React.ComponentClass|React.ReactNode)} getter
     * @param {React.Key} [key]
     * @return {React.ReactNode}
     */
    render(getter, key) {
        return null;
    }
}
