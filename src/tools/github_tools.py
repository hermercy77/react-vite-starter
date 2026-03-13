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


def get_branch(repo_name: str, branch_name: str):
    """获取分支对象"""
    repo = get_repo(repo_name)
    try:
        return repo.get_branch(branch_name)
    except GithubException as e:
        raise ValueError(f"Failed to access branch '{branch_name}': {e}")


def get_file_content(repo_name: str, file_path: str, branch: str = "main") -> Optional[str]:
    """获取仓库中文件的内容"""
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


def get_pull_request_diff(repo_name: str, pr_number: int) -> str:
    """获取 PR 的 diff"""
    repo = get_repo(repo_name)
    try:
        pr = repo.get_pull(pr_number)
        files = pr.get_files()
        diff_parts = []
        for f in files:
            diff_parts.append(f"--- {f.filename}\n{f.patch or '(binary or empty)'}")
        return "\n\n".join(diff_parts)
    except GithubException as e:
        raise ValueError(f"Failed to get PR #{pr_number} diff: {e}")


def get_branch_diff(repo_name: str, branch_name: str, base_branch: str = "main") -> str:
    """获取分支与基准分支之间的 diff"""
    repo = get_repo(repo_name)
    try:
        comparison = repo.compare(base_branch, branch_name)
        diff_parts = []
        for f in comparison.files:
            diff_parts.append(f"--- {f.filename}\n{f.patch or '(binary or empty)'}")
        return "\n\n".join(diff_parts)
    except GithubException as e:
        raise ValueError(f"Failed to compare '{base_branch}' with '{branch_name}': {e}")


def list_branch_files(repo_name: str, branch: str, path: str = "") -> list:
    """列出分支中指定路径下的文件"""
    repo = get_repo(repo_name)
    try:
        contents = repo.get_contents(path, ref=branch)
        if not isinstance(contents, list):
            contents = [contents]
        result = []
        for item in contents:
            result.append({
                "path": item.path,
                "type": item.type,
                "size": item.size,
            })
        return result
    except GithubException as e:
        raise ValueError(f"Failed to list files at '{path}' on branch '{branch}': {e}")


def create_branch(repo_name: str, branch_name: str, base_branch: str = "main") -> str:
    """从基准分支创建新分支"""
    repo = get_repo(repo_name)
    try:
        base = repo.get_branch(base_branch)
        ref = repo.create_git_ref(
            ref=f"refs/heads/{branch_name}",
            sha=base.commit.sha,
        )
        return ref.ref
    except GithubException as e:
        raise ValueError(f"Failed to create branch '{branch_name}': {e}")


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
        return {"number": pr.number, "url": pr.html_url}
    except GithubException as e:
        raise ValueError(f"Failed to create pull request: {e}")
