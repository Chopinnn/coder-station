import React from 'react'

function PageFooter (props) {
  return (
        <div>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Email to me
                </a>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    博客
                </a>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Github
                </a>
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Contact me
                </a>
            </p>
            <p>© 2023 - Coder Station</p>
            <p>Powered by Create React App</p>
        </div>
  )
}

export default PageFooter
