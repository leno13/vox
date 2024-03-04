#!/usr/bin/python3.10

import json, sys
from os import path as ospath

class Po2Json():

    def __init__(self, FILE, ODIR):
        self.file = FILE
        self.ofile = ospath.basename(FILE).split('.po')[0]+ '.json'
        self.ofile = ospath.join(ODIR, self.ofile)

        self.dex = {
            'meta'      :{},
            'context'   :{},
            'singular'  :{},
            'plural'    :{}
        }

        self.read_file()
        # self.get_plural()
        self.process_lines()

    def read_file(self):
        self.lines = []
        try:
            with open(self.file, '+r') as f:
                self.lines = f.readlines()
        except Exception as e:
            print('exception:', e)
            sys.exit(1)

    def get_plural(self):
        """
        This function is obsolete
        """
        delimiter = 'Plural-Forms: nplurals='
        for line in self.lines:
            if delimiter in line:
                # get first char after = in delimiter
                self.n = line.split(delimiter)[1][0]
                # remove last 5 char form end of string
                self.dex['meta']['nplurals'] = self.n
                self.dex['meta']['plural'] = line[line.rfind('plural=')+7:-5].strip()
                break
        return
    
    def process_lines(self):

        cplines = self.lines.copy()
        cplines = cplines[cplines.index('\n')+1:] # remove metadata
        cplines.append('#') # to simulate existance of a new msgid

        group_type = 'singular' # as default
        group_data = {}
        msgid = ''
        contextid = ''

        def get_line_key_n_value(line):
            i = line.index(' ')
            key = line[:i].strip()
            val = str(line[i+2:-2].strip())
            return key, val

        for line in cplines:

            if line[0] == '#' or line == '\n':
                # if first char from line is #
                # or line is \n
                if not group_data:
                    # group_data empty, do nothing
                    continue

                if group_type == 'singular' or group_type == 'plural':
                    self.dex[group_type].update(group_data)
                elif group_type == 'context':
                    self.dex[group_type][contextid] = group_data

                group_data = {}
                group_type = 'singular'
                continue
            
            key, val = get_line_key_n_value(line)
            
            if 'msgctxt' in key:
                group_type = 'context'
                self.dex['context'][val] = ""
                contextid = val
            if 'msgid_plural' in key:
                group_type = 'plural'
                group_data[msgid] = []
                continue
            if 'msgid' in key and 'msgid_plural' not in key:
                msgid = val
                group_data[msgid] = val
                if group_type != 'context':
                    group_type = 'singular'
                continue
            if group_type == 'singular' or group_type=='context':
                if 'msgstr' in key:
                    group_data[msgid] = val
                continue
            if group_type == 'plural':
                if 'msgstr[' in key:
                    group_data[msgid].append(val)

        # print('******* DEX *******')
        # print(json.dumps(self.dex,indent=4))

    def save_json2file(self):

        with open(self.ofile, 'w') as f:
            f.write(json.dumps(self.dex, indent=4))
            print(f"File {self.ofile} has been created")


if __name__ == "__main__":

    try:
        FILE = sys.argv[1]
        ODIR = './' if len(sys.argv) == 2 else sys.argv[2]
    except:
        print('First  argument: file.po')
        print('Second argument: output dir, default: ./')
        sys.exit()
    if '.po' not in FILE:
        print('File does not have extension .po')
        sys.exit()
    p2j = Po2Json(FILE, ODIR)
    p2j.save_json2file()
    print("Done")