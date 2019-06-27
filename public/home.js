const e = React.createElement;

const AppNav = () => (
    <nav className="navbar navbar-dark bg-dark">
        <a href="#" className="nav-brand">Bloggy</a>
        <a role="button" className="btn btn-info-outline navbar-btn">Login</a>
    </nav>
)

export default class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        <div>
               <AppNav />
            <div class="card mt-4" Style="width: 100%;">
                <div class="card-body">
                    Please login to see your posts.
                </div>
            </div>
        </div>
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);