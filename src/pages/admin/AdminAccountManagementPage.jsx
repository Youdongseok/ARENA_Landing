import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useAdminAccountsQuery } from '@/hooks/useAdminAccountsQuery';
import { useAdminAccountActions } from '@/hooks/useAdminAccountActions';

const EMPTY_CREATE_FORM = {
  teamname: '',
  login_id: '',
  password: '',
  proxy_base_url: false,
  api_key: '',
};

export default function AdminAccountManagementPage() {
  const { data, isLoading } = useAdminAccountsQuery();
  const { createAccount, isCreating } = useAdminAccountActions();

  const [keyword, setKeyword] = useState('');
  const [isSearchUnlocked, setIsSearchUnlocked] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [createError, setCreateError] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);
  const searchInputRef = useRef(null);

  const filteredAccounts = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return data ?? [];
    return (data ?? []).filter(account => {
      return (
        account.teamname?.toLowerCase().includes(normalized) ||
        account.login_id?.toLowerCase().includes(normalized)
      );
    });
  }, [data, keyword]);

  useEffect(() => {
    if (!searchInputRef.current) return;
    if (searchInputRef.current.value !== keyword) {
      searchInputRef.current.value = keyword;
    }
  }, [keyword, editingAccount]);

  const handleCreateChange = event => {
    const { name, value, type, checked } = event.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateAccount = async () => {
    try {
      setCreateError('');
      await createAccount({
        ...createForm,
        api_key: createForm.api_key.trim() || null,
      });
      setCreateForm(EMPTY_CREATE_FORM);
    } catch (error) {
      setCreateError(error?.response?.data?.detail || '사용자 계정 생성에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="p-10 text-white">로딩 중...</div>;
  }

  return (
    <div className="mx-auto max-w-[1200px] p-10 text-white">
      <h1 className="mb-8 text-4xl font-bold text-[#FF4854]">사용자 계정 관리</h1>

      <section className="mb-8 rounded-xl border border-[#FF4854]/30 bg-[#0B021C]/60 p-5">
        <h2 className="mb-4 text-xl font-bold text-white">사용자 계정 생성</h2>
        <form
          autoComplete="off"
          className="contents"
          onSubmit={event => {
            event.preventDefault();
            handleCreateAccount();
          }}
        >
          <Input
            label="사용자명"
            name="teamname"
            value={createForm.teamname}
            onChange={handleCreateChange}
            autoComplete="off"
          />
          <Input
            label="로그인 아이디"
            name="login_id"
            value={createForm.login_id}
            onChange={handleCreateChange}
            autoComplete="off"
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={createForm.password}
            onChange={handleCreateChange}
            autoComplete="new-password"
          />
          <Input
            label="API Key"
            name="api_key"
            value={createForm.api_key}
            onChange={handleCreateChange}
            autoComplete="off"
          />
        </form>

        <label className="mt-4 flex items-center gap-2 text-sm text-[#FFB8BF]">
          <input
            type="checkbox"
            name="proxy_base_url"
            checked={createForm.proxy_base_url}
            onChange={handleCreateChange}
          />
          프록시 사용
        </label>

        {createError ? <p className="mt-4 text-sm font-semibold text-[#FF9A9A]">{createError}</p> : null}

        <button
          type="button"
          onClick={handleCreateAccount}
          disabled={isCreating}
          className="mt-5 rounded-lg bg-[#FF4854] px-5 py-3 font-semibold transition hover:bg-[#e13a47] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? '생성 중...' : '사용자 계정 생성'}
        </button>
      </section>

      <section className="mb-8 rounded-xl border border-[#FF4854]/30 bg-[#0B021C]/60 p-5">
        <label className="mb-2 block text-sm font-semibold text-[#FFB8BF]">사용자 검색</label>
        <input
          ref={searchInputRef}
          type="text"
          name="admin_filter_keyword_search_only"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onFocus={() => setIsSearchUnlocked(true)}
          readOnly={!isSearchUnlocked}
          autoComplete="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          aria-autocomplete="none"
          className="w-full rounded-lg border border-[#FF4854]/30 bg-[#1A0B15]/70 px-4 py-2 text-white outline-none"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredAccounts.map(account => (
          <div
            key={account.id}
            className="rounded-xl border border-[#FF4854]/40 bg-[#0B021C]/70 p-5 shadow-lg"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{account.teamname}</h2>
                <p className="mt-1 text-sm text-[#FFB8BF]">@{account.login_id}</p>
              </div>
              <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-xs font-bold text-[#FF4854]">
                #{account.id}
              </span>
            </div>

            <div className="space-y-2 text-sm text-white/70">
              <p>프록시 사용: {account.proxy_base_url ? '예' : '아니오'}</p>
              <p>API Key: {account.api_key || '-'}</p>
              <p>프로필 이미지: {account.profile_image_url ? '등록됨' : '없음'}</p>
            </div>

            <button
              type="button"
              onClick={() => setEditingAccount(account)}
              className="mt-4 w-full rounded-lg bg-[#FF4854] py-2 transition hover:bg-[#e13a47]"
            >
              수정 / 삭제
            </button>
          </div>
        ))}
      </div>

      {editingAccount ? (
        <AdminAccountEditModal account={editingAccount} onClose={() => setEditingAccount(null)} />
      ) : null}
    </div>
  );
}

function AdminAccountEditModal({ account, onClose }) {
  const { updateAccount, deleteAccount, isUpdating, isDeleting } = useAdminAccountActions();
  const [form, setForm] = useState({
    teamname: account.teamname ?? '',
    login_id: account.login_id ?? '',
    password: '',
    proxy_base_url: !!account.proxy_base_url,
    api_key: account.api_key ?? '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setErrorMessage('');
      await updateAccount({
        id: account.id,
        payload: {
          teamname: form.teamname.trim() || undefined,
          login_id: form.login_id.trim() || undefined,
          password: form.password || null,
          proxy_base_url: form.proxy_base_url,
          api_key: form.api_key.trim() || undefined,
        },
      });
      onClose();
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || '사용자 계정 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 사용자 계정을 삭제하시겠습니까?')) return;
    try {
      setErrorMessage('');
      await deleteAccount(account.id);
      onClose();
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || '사용자 계정 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[700px] max-h-[90vh] overflow-y-auto rounded-xl border border-[#FF4854] bg-[#0B021C] p-8 text-white shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-[#FF4854]">사용자 계정 수정 / 삭제</h2>

        <div className="mb-6 rounded-xl border border-[#FF4854]/30 bg-[#1A0B15]/50 p-4 text-sm text-white/75">
          <p>현재 사용자명: {account.teamname}</p>
          <p className="mt-1">현재 로그인 아이디: {account.login_id}</p>
          <p className="mt-1">현재 API Key: {account.api_key || '-'}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="사용자명"
            name="teamname"
            value={form.teamname}
            onChange={handleChange}
            placeholder="변경할 때만 입력"
          />
          <Input
            label="로그인 아이디"
            name="login_id"
            value={form.login_id}
            onChange={handleChange}
            placeholder="변경할 때만 입력"
          />
          <Input
            label="새 비밀번호"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="변경할 때만 입력"
          />
          <Input
            label="API Key"
            name="api_key"
            value={form.api_key}
            onChange={handleChange}
            placeholder="변경할 때만 입력"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-[#FFB8BF]">
          <input
            type="checkbox"
            name="proxy_base_url"
            checked={form.proxy_base_url}
            onChange={handleChange}
          />
          프록시 사용
        </label>

        {errorMessage ? (
          <p className="mt-4 text-sm font-semibold text-[#FF9A9A]">{errorMessage}</p>
        ) : null}

        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-lg font-bold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? '저장 중...' : '수정하기'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 py-3 text-lg font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-500 py-2 transition hover:bg-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  autoComplete = 'off',
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#FFB8BF]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-lpignore="true"
        data-1p-ignore="true"
        className="rounded-lg border border-[#FF4854]/30 bg-[#1A0B15]/70 px-4 py-2 text-white outline-none"
      />
    </div>
  );
}
