'use strict'; 
const e = React.createElement;

const AppNavbar = () => (
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="#">My Blog</a>
    <a role="button" class="btn btn-outline-info navbar-btn" href="/logout">Logout</a>
  </nav>
);

const Card = ((item, handleSubmit, handleEdit, handleDelete, handleCancel ) => {
    const { title, content, editeMode } = item;

    if (editMode) {
        return (
            <div class="card mt-4" Style="width: 100%;">
                <div class="card-body">
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={item.id} />
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" name="title" class="form-control" placeholder="Title" defaultValue={title} />
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <textarea name="content" class="form-control" placeholder="Content" defaultValue={content}></textarea>
                        </div>
                        <button type="button" class="btn btn-outline-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                        <button type="submit" class="btn btn-info btn-sm ml-2">Save</button>
                    </form>
                </div>
            </div>
        )
    } else {
        return(
            <div class="card mt-4" Style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">{title || "No Title"}</h5>
                <p class="card-text">{content || "No Content"}</p>
                <button type="button" class="btn btn-outline-danger btn-sm" onClick={handleDelete}>Delete</button>
                <button type="submit" class="btn btn-info btn-sm ml-2" onClick={handleEdit}>Edit</button>
            </div>
        </div>
        );
    }
});

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts = async () => {
        const response = fetch('/posts');
        const data = await response.json();
        data.forEach(item=>item.editMode=false);
        this.setState({ data });
    }

    addNewPost = () => {
        const data = this.state.data;
        data.unshift({
            editMode: true,
            title: '',
            content: '',
        });
        this.setState({ data });
    }

    handleCancel = async () => {
        await this.getPosts();
    }

    handleEdit = (postId) => {
        const data = this.state.data.map((item) => {
            item.id === postId ? item.editMode = true : item.editMode = false;
            return item;
        });
        this.setState({ data });
    }

    handleDelete = (postId) => {
        await fetch(`posts/${posts.id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            }
        });

        await this.getPosts();
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const body = JSON.stringify({
            title: data.get('title'),
            content: data.get('content'),
        });
        const headers = {
            'content-type': 'application/json',
             accept: 'application/json',
        }
        if (data.get('id')) {
            await fetch(`/posts/${data.get('id')}`, {
                method: 'PUT',
                headers,
                body,
            });
        } else {
            await fetch('/posts', {
                method: 'POST',
                headers,
                body,
            });
        }
        await this.getPosts();
    }

    render() {
        return(

        );
    }
}
