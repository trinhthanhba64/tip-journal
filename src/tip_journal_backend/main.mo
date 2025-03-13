import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";

actor class Main() = this {
  type Result<T> = Result.Result<T, Text>;
  type Post = {
    id : Nat;
    author : Principal;
    title : Text;
    content : Text;
    created_at : Int;
  };

  type Tip = {
    sender : Principal;
    recipient : Principal;
    amount : Nat;
    timestamp : Int;
  };

  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;
  stable var tips : [Tip] = [];

  public shared ({ caller }) func createPost(title : Text, content : Text) : async Result<Post> {
    let post : Post = {
      id = nextId;
      author = caller;
      title = title;
      content = content;
      created_at = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;

    return #ok(post);
  };

  public shared query func getPosts() : async Result<[Post]> {
    return #ok(
      Array.sort<Post>(
        posts,
        func(a, b) : { #equal; #greater; #less } {
          if (b.created_at > a.created_at) #greater else if (b.created_at < a.created_at) #less else #equal;
        },
      )
    );
  };
};
