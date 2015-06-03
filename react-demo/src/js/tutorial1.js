"usr strict";

var Comment = React.createClass({
    render: function() {
        var rawMarkup = marked(this.props.children.toString());
        return (
            <div className="comment">
                <h2>
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML = {{__html: rawMarkup}}></span>
            </div>
            );
    }
});

var CommentBox = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div class="conmentbox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm />
            </div>
            );
    }
});

var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function (comment) {
            return (
              <Comment author={comment.author}>
                  {comment.text}
              </Comment>
              )
          });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
            );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if(!text || !author) {
            return;
        }
        //TODO:send request to the server
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function () {
        return (
            <form className="commentForm">
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text"/>
                <input type="submit" value="Post"/>
            </form>
            )
    }
});
var data = [];
setTimeout(function(){
data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];
React.render(
    <CommentBox url="/comments.json" pollInterval={2000}/>,
    document.getElementById('content')
    );
});

