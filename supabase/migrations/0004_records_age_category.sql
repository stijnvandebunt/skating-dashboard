alter table records add column age text not null default 'sr' check (age in ('sr', 'jr'));
