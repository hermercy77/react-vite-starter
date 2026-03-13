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
    """获取 GitHub 仓库对象
    
    Args:
        repo_name: 仓库全名，格式为 'owner/repo'
    """
    client = get_github_client()
    try:
        return client.get_repo(repo_name)
    except GithubException as e:
        raise ValueError(f"Failed to access repository '{repo_name}': {e}")


def get_pull_request(repo_name: str, pr_number: int):
    """获取 Pull Request 对象
    
    Args:
        repo_name: 仓库全名
        pr_number: PR 编号
    """
    repo = get_repo(repo_name)
    try:
        return repo.get_pull(pr_number)
    except GithubException as e:
        raise ValueError(f"Failed to get PR #{pr_number} from '{repo_name}': {e}")


def get_pr_diff(repo_name: str, pr_number: int) -> str:
    """获取 PR 的 diff 内容
    
    Args:
        repo_name: 仓库全名
        pr_number: PR 编号
        
    Returns:
        diff 字符串
    """
    try:
        pr = get_pull_request(repo_name, pr_number)
        files = pr.get_files()
        diff_parts = []
        for f in files:
            diff_parts.append(f"--- a/{f.filename}")
            diff_parts.append(f"+++ b/{f.filename}")
            if f.patch:
                diff_parts.append(f.patch)
            diff_parts.append("")
        return "\n".join(diff_parts)
    except Exception as e:
        raise ValueError(f"Error getting diff for PR #{pr_number}: {e}")


def get_pr_files(repo_name: str, pr_number: int) -> list:
    """获取 PR 中修改的文件列表
    
    Args:
        repo_name: 仓库全名
        pr_number: PR 编号
        
    Returns:
        文件信息列表
    """
    try:
        pr = get_pull_request(repo_name, pr_number)
        files = pr.get_files()
        return [
            {
                "filename": f.filename,
                "status": f.status,
                "additions": f.additions,
                "deletions": f.deletions,
                "changes": f.changes,
                "patch": f.patch if f.patch else "",
            }
            for f in files
        ]
    except Exception as e:
        raise ValueError(f"Error getting files for PR #{pr_number}: {e}")


def create_pr_comment(repo_name: str, pr_number: int, body: str) -> bool:
    """在 PR 上创建评论
    
    Args:
        repo_name: 仓库全名
        pr_number: PR 编号
        body: 评论内容
        
    Returns:
        是否成功
    """
    try:
        pr = get_pull_request(repo_name, pr_number)
        pr.create_issue_comment(body)
        return True
    except Exception as e:
        raise ValueError(f"Error creating comment on PR #{pr_number}: {e}")


def create_pr_review(repo_name: str, pr_number: int, body: str, event: str = "COMMENT") -> bool:
    """在 PR 上创建 review
    
    Args:
        repo_name: 仓库全名
        pr_number: PR 编号
        body: review 内容
        event: review 事件类型 (COMMENT, APPROVE, REQUEST_CHANGES)
        
    Returns:
        是否成功
    """
    try:
        pr = get_pull_request(repo_name, pr_number)
        pr.create_review(body=body, event=event)
        return True
    except Exception as e:
        raise ValueError(f"Error creating review on PR #{pr_number}: {e}")


def get_file_content(repo_name: str, file_path: str, ref: Optional[str] = None) -> str:
    """获取仓库中某个文件的内容
    
    Args:
        repo_name: 仓库全名
        file_path: 文件路径
        ref: 分支名或 commit SHA
        
    Returns:
        文件内容字符串
    """
    try:
        repo = get_repo(repo_name)
        kwargs = {}
        if ref:
            kwargs["ref"] = ref
        content = repo.get_contents(file_path, **kwargs)
        if isinstance(content, list):
            raise ValueError(f"'{file_path}' is a directory, not a file")
        return content.decoded_content.decode("utf-8")
    except GithubException as e:
        raise ValueError(f"Error getting file '{file_path}' from '{repo_name}': {e}")


def get_branch_files(repo_name: str, branch: str, path: str = "") -> list:
    """获取分支上某个目录下的文件列表
    
    Args:
        repo_name: 仓库全名
        branch: 分支名
        path: 目录路径
        
    Returns:
        文件路径列表
    """
    try:
        repo = get_repo(repo_name)
        contents = repo.get_contents(path, ref=branch)
        files = []
        while contents:
            file_content = contents.pop(0)
            if file_content.type == "dir":
                contents.extend(repo.get_contents(file_content.path, ref=branch))
            else:
                files.append(file_content.path)
        return files
    except GithubException as e:
        raise ValueError(f"Error listing files in '{repo_name}' branch '{branch}': {e}")


def create_or_update_file(
    repo_name: str,
    file_path: str,
    content: str,
    commit_message: str,
    branch: str,
) -> bool:
    """创建或更新仓库中的文件
    
    Args:
        repo_name: 仓库全名
        file_path: 文件路径
        content: 文件内容
        commit_message: 提交信息
        branch: 目标分支
        
    Returns:
        是否成功
    """
    try:
        repo = get_repo(repo_name)
        try:
            existing = repo.get_contents(file_path, ref=branch)
            if isinstance(existing, list):
                raise ValueError(f"'{file_path}' is a directory")
            repo.update_file(
                file_path,
                commit_message,
                content,
                existing.sha,
                branch=branch,
            )
        except GithubException as e:
            if e.status == 404:
                repo.create_file(
                    file_path,
                    commit_message,
                    content,
                    branch=branch,
                )
            else:
                raise
        return True
    except Exception as e:
        raise ValueError(f"Error creating/updating '{file_path}': {e}")


def find_open_pr(repo_name: str, head_branch: str) -> Optional[int]:
    """查找指定分支的 open PR
    
    Args:
        repo_name: 仓库全名
        head_branch: 源分支名
        
    Returns:
        PR 编号，如果没有则返回 None
    """
    try:
        repo = get_repo(repo_name)
        owner = repo_name.split("/")[0]
        pulls = repo.get_pulls(state="open", head=f"{owner}:{head_branch}")
        for pr in pulls:
            return pr.number
        return None
    except Exception as e:
        raise ValueError(f"Error finding PR for branch '{head_branch}': {e}")
