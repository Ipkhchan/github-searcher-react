import React, { Component } from 'react';
import './App.css';
import RepoTable from './repoTable';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: [],
                  favorites: []}
  }

  componentDidMount() {
    this.setState({favorites: (JSON.parse(localStorage.getItem("favorites")) || [])});
  }

  checkInputLength = (e) => {
    if(!e.target.value.length) {
      this.setState({searchResults: []});
    }
  }

  updateLists = (favorites = [...this.state.favorites], searchResults = [...this.state.searchResults]) => {
    const favoritesUrls = favorites.map((favorite) => {return favorite.url});

    searchResults.forEach((repo) => {
      if (favoritesUrls.indexOf(repo.url) > -1) {
        repo.faved = true;
      }
      else {
        repo.faved = false;
      }
    })

    this.setState({searchResults: searchResults, favorites: favorites});
    localStorage.setItem("favorites", JSON.stringify(favorites));

  }

  addFavorite = (e, index) => {
    e.preventDefault();
    this.updateLists([...this.state.favorites, this.state.searchResults[index]]);
  }

  removeFavorite = (e, index) => {
    e.preventDefault();
    let faves = [...this.state.favorites];
    faves.splice(index, 1);
    this.updateLists(faves);
  }

  searchRepos = (e) => {
    e.preventDefault();

    axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {"Authorization": `bearer ${process.env.REACT_APP_GITHUB_TOKEN}`},
      data: JSON.stringify({
       query :
        `query {
          search(query: ${document.querySelector('.searchInput').value}, type: REPOSITORY, first: 10) {
        		edges {
              node {
                ... on Repository{
                  name
                  owner {
                    login
                  }
                  releases(last: 1) {
                    nodes {
                      tag {
                        name
                      }
                    }
                  }
                  url
                  primaryLanguage {
                    name
                  }
                }
              }
            }
          }
        }`
      })
    }).then((results) => {
      let repos = [];

      results.data.data.search.edges.forEach((result) => {
        repos.push(
          {name: result.node.name,
           owner: result.node.owner.login,
           primeLang: (result.node.primaryLanguage ? result.node.primaryLanguage.name : "-"),
           lastTag: (result.node.releases.nodes[0] ? result.node.releases.nodes[0].tag.name : "-"),
           url: result.node.url,
           faved: false
          }
        )
      })

      this.updateLists(this.state.favorites, repos);
    })
  }

  render() {
    return (
      <div>
        <h1>My Github Favorites</h1>
        <div className="flex">
          <div className="searchContainer">
            <form action="#" className="searchForm flex flex-justify-space-between">
              <input type="text" className="searchInput" onKeyUp={this.checkInputLength} />
              <input type="submit" className="searchButton" value="Search" onClick= {this.searchRepos}/>
            </form>
            <RepoTable repos={this.state.searchResults} handleLink={this.addFavorite} linkText="Add"/>
          </div>
          <div className="favoritesContainer">
            <RepoTable repos={this.state.favorites} handleLink={this.removeFavorite} linkText="Remove"/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
