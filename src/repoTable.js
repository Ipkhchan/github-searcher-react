import React from 'react';

const RepoTable = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th className="primeLang">Language</th>
          <th className="lastTag">Latest tag</th>
          <th className="emptyHeader"></th>
        </tr>
      </thead>
      {(props.repos.length)
        ? <tbody className="resultsDisplay">
            {props.repos.map((repo, index) =>
              <tr key={`${repo.name}/${repo.owner}`}>
                 <td><a href={repo.url} className="repoLink" target="_blank" rel="noopener noreferrer">{repo.name}/{repo.owner}</a></td>
                 <td className="primeLang">{repo.primeLang}</td>
                 <td className="lastTag">{repo.lastTag}</td>
                 {(props.linkText === "Add")
                   ? (repo.faved === false)
                      ? <td><a href="##" className={props.linkText} onClick={(e) => props.handleLink(e, index)}>{props.linkText}</a></td>
                      : null
                   : <td><a href="##" className={props.linkText} onClick={(e) => props.handleLink(e, index)}>{props.linkText}</a></td>
                 }
               </tr>
            )}
          </tbody>
        : null
      }
    </table>
  )
}


export default RepoTable
