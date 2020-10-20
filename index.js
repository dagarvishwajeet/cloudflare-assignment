const links = [
    { "name": "Amazon", "url": "https://www.amazon.com/" },
    { "name": "Google", "url": "https://www.google.com/" },
    { "name": "Yahoo", "url": "https://www.yahoo.com/" }
]

const socialLinks = [
    {
        url: 'https://www.linkedin.com/in/v-dagar/',
        icon: 'https://simpleicons.org/icons/linkedin.svg',
    },
    {
        url: 'https://scholar.google.com/citations?user=BRzh1W4AAAAJ&hl=en',
        icon: 'https://simpleicons.org/icons/googlescholar.svg',
    }
]

class LinksTransformer {
    constructor(links) {
        this.links = links
    }

    getLinkTag(link) {
        if(link.icon) {
            return `<a href=${link.url}>
                        <img src=${link.icon}></img>
                    </a>`
        } else {
            return `<a href=${link.url}>${link.name}</a>`
        }
    }
    
    async element(element) {
        this.links.forEach(link => {
            element.append(this.getLinkTag(link), {html: true})
        })
    }
}

class RemoveAttributeTransformer {
    constructor(attribute) {
        this.attributeName = attribute
    }
    
    async element(element) {
        element.removeAttribute(this.attributeName)
    }
}

class SetAttributeTransformer {
    constructor(attribute, value) {
        this.attributeName = attribute
        this.attributeValue = value
    }

    async element(element) {
        element.setAttribute(this.attributeName, this.attributeValue)
    }
}

class SetInnerContentTransformer {
    constructor(value) {
        this.contentValue = value
    }

    async element(element) {
        element.setInnerContent(this.contentValue)
    }
}

const rewriter = new HTMLRewriter()
    .on('div#links', new LinksTransformer(links))
    .on('div#profile', new RemoveAttributeTransformer('style'))
    .on('img#avatar',
        new SetAttributeTransformer(
            'src',
            'https://avatars1.githubusercontent.com/u/49143998?s=460&v=4',
        )
    )
    .on('h1#name', new SetInnerContentTransformer('dagarvishwajeet'))
    .on('div#social', new RemoveAttributeTransformer('style'))
    .on('div#social', new LinksTransformer(socialLinks))
    .on('title', new SetInnerContentTransformer('Vishwajeet Dagar'))
    .on('body', new SetAttributeTransformer("class", "bg-green-600"))


async function pageHandler() {
    const staticUrl = 'https://static-links-page.signalnerve.workers.dev'
    const init = {
        headers: {
            "content-type": "text/html;charset=UTF-8"
        }
    }
    let response = await fetch(staticUrl, init)
    if (response.ok) {
        return rewriter.transform(response);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function linkHandler() {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links)
    return new Response(body, init)
}

async function handleRequest(request) {
    const url = new URL(request.url)
    const path = url.pathname

    if(path === '/links') {
        return linkHandler()
    } else {
        return pageHandler()
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})