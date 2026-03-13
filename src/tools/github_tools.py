import os
import re
import json
from typing import Optional
from github import Github, GithubException


def get_github_client() -> Github:
    """获取 GitHub 客户端实例"""
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise ValueError("GITHUB_TOKEN environment variable is not set")
    return Github(token)


def get_repo(repo_name: str):
    """获取 GitHub 仓库对象"""
    client = get_github_client()
    try:
        return client.get_repo(repo_name)
    except GithubException as e:
        raise ValueError(f"Failed to access repository '{repo_name}': {e}")


def get_file_content(repo_name: str, file_path: str, branch: str = "main") -> Optional[str]:
    """获取仓库中指定文件的内容"""
    repo = get_repo(repo_name)
    try:
        content = repo.get_contents(file_path, ref=branch)
        if isinstance(content, list):
            raise ValueError(f"'{file_path}' is a directory, not a file")
        return content.decoded_content.decode("utf-8")
    except GithubException as e:
        if e.status == 404:
            return None
        raise ValueError(f"Failed to get file '{file_path}': {e}")


def create_or_update_file(
    repo_name: str,
    file_path: str,
    content: str,
    commit_message: str,
    branch: str,
) -> dict:
    """创建或更新仓库中的文件"""
    repo = get_repo(repo_name)
    try:
        existing = repo.get_contents(file_path, ref=branch)
        if isinstance(existing, list):
            raise ValueError(f"'{file_path}' is a directory")
        result = repo.update_file(
            path=file_path,
            message=commit_message,
            content=content,
            sha=existing.sha,
            branch=branch,
        )
        return {"action": "updated", "commit": result["commit"].sha}
    except GithubException as e:
        if e.status == 404:
            result = repo.create_file(
                path=file_path,
                message=commit_message,
                content=content,
                branch=branch,
            )
            return {"action": "created", "commit": result["commit"].sha}
        raise ValueError(f"Failed to create/update file '{file_path}': {e}")


def get_branch(repo_name: str, branch_name: str):
    """获取分支信息"""
    repo = get_repo(repo_name)
    try:
        return repo.get_branch(branch_name)
    except GithubException as e:
        if e.status == 404:
            return None
        raise ValueError(f"Failed to get branch '{branch_name}': {e}")


def create_branch(repo_name: str, branch_name: str, source_branch: str = "main") -> dict:
    """从源分支创建新分支"""
    repo = get_repo(repo_name)
    try:
        source = repo.get_branch(source_branch)
        ref = repo.create_git_ref(
            ref=f"refs/heads/{branch_name}",
            sha=source.commit.sha,
        )
        return {"branch": branch_name, "sha": ref.object.sha}
    except GithubException as e:
        if e.status == 422:
            return {"branch": branch_name, "status": "already_exists"}
        raise ValueError(f"Failed to create branch '{branch_name}': {e}")


def get_pull_request(repo_name: str, pr_number: int):
    """获取 Pull Request"""
    repo = get_repo(repo_name)
    try:
        return repo.get_pull(pr_number)
    except GithubException as e:
        raise ValueError(f"Failed to get PR #{pr_number}: {e}")


def create_pull_request(
    repo_name: str,
    title: str,
    body: str,
    head: str,
    base: str = "main",
) -> dict:
    """创建 Pull Request"""
    repo = get_repo(repo_name)
    try:
        pr = repo.create_pull(
            title=title,
            body=body,
            head=head,
            base=base,
        )
        return {"pr_number": pr.number, "url": pr.html_url}
    except GithubException as e:
        raise ValueError(f"Failed to create PR: {e}")


def get_diff(repo_name: str, base: str, head: str) -> str:
    """获取两个分支之间的 diff"""
    repo = get_repo(repo_name)
    try:
        comparison = repo.compare(base, head)
        diffs = []
        for f in comparison.files:
            diff_entry = f"--- a/{f.filename}\n+++ b/{f.filename}\n"
            if f.patch:
                diff_entry += f.patch
            diffs.append(diff_entry)
        return "\n".join(diffs)
    except GithubException as e:
        raise ValueError(f"Failed to get diff between '{base}' and '{head}': {e}")


def list_files_in_directory(
    repo_name: str, directory: str = "", branch: str = "main"
) -> list[str]:
    """列出仓库目录中的文件"""
    repo = get_repo(repo_name)
    try:
        contents = repo.get_contents(directory, ref=branch)
        if not isinstance(contents, list):
            return [contents.path]
        paths = []
        while contents:
            item = contents.pop(0)
            if item.type == "dir":
                sub = repo.get_contents(item.path, ref=branch)
                if isinstance(sub, list):
                    contents.extend(sub)
                else:
                    paths.append(sub.path)
            else:
                paths.append(item.path)
        return paths
    except GithubException as e:
        raise ValueError(f"Failed to list files in '{directory}': {e}")


def add_pr_comment(repo_name: str, pr_number: int, comment: str) -> dict:
    """给 PR 添加评论"""
    repo = get_repo(repo_name)
    try:
        pr = repo.get_pull(pr_number)
        issue_comment = pr.create_issue_comment(comment)
        return {"comment_id": issue_comment.id}
    except GithubException as e:
        raise ValueError(f"Failed to add comment to PR #{pr_number}: {e}")
